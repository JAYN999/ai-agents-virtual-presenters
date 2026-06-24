import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import { ensureDirectoriesExist } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Unified SadTalker path
const SADTALKER_PATH = path.resolve(__dirname, '../AI/SadTalker-main/SadTalker-main');

const SADTALKER_AUDIO_PATH = path.join(SADTALKER_PATH, 'input.wav');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// ─────────────────────────────────────────────────────────────
// PCM → WAV
// ─────────────────────────────────────────────────────────────

function pcmToWav(pcmData, sampleRate, bitsPerSample, numChannels) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const fileSize = headerSize + dataSize;

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  pcmData.copy(buffer, offset);
  return buffer;
}

// ─────────────────────────────────────────────────────────────
// Local Windows TTS fallback
// ─────────────────────────────────────────────────────────────

function generateLocalVoice(text, gender = 'male') {
  console.log(`🔊 Using local Windows TTS fallback (${gender})...`);

  const safeText = text
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .substring(0, 2000);

  const sadTalkerDir = path.dirname(SADTALKER_AUDIO_PATH);
  if (!fs.existsSync(sadTalkerDir)) {
    fs.mkdirSync(sadTalkerDir, { recursive: true });
  }

  const tempTextFile = path.join(sadTalkerDir, '_tts_input.txt');
  fs.writeFileSync(tempTextFile, safeText, 'utf8');

  const wavPath = SADTALKER_AUDIO_PATH.replace(/\\/g, '/');
  const txtPath = tempTextFile.replace(/\\/g, '/');

  // Select a female or male voice from installed Windows voices
  const voiceGenderFilter = gender === 'female' ? 'Female' : 'Male';

  const psScript = `
    Add-Type -AssemblyName System.Speech;
    $text = [System.IO.File]::ReadAllText('${txtPath}');
    $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;
    $voices = $speak.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Gender -eq '${voiceGenderFilter}' };
    if ($voices.Count -gt 0) {
      $speak.SelectVoice($voices[0].VoiceInfo.Name);
    }
    $speak.Rate = 0;
    $speak.SetOutputToWaveFile('${wavPath}');
    $speak.Speak($text);
    $speak.Dispose();
  `;

  execSync(`powershell -Command "${psScript.replace(/\n/g, ' ')}"`, {
    windowsHide: true,
    timeout: 120000,
  });

  return SADTALKER_AUDIO_PATH;
}

// ─────────────────────────────────────────────────────────────
// ElevenLabs Voice Generation
// ─────────────────────────────────────────────────────────────

export async function generateVoice(text, gender, sessionId) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for voice generation');
  }

  const normalizedGender =
    gender && gender.toLowerCase() === 'female'
      ? 'female'
      : 'male';

  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('⚠️ ELEVENLABS_API_KEY not configured — using local TTS');
    return generateLocalVoice(text, normalizedGender);
  }

  // Premade voices (free tier compatible):
  //   Adam (male):  pNInz6obpgDQGcFmaJgB
  //   Sarah (female): EXAVITQu4vr4xnSDxMaL
  const voiceId =
    normalizedGender === 'female'
      ? process.env.ELEVENLABS_FEMALE_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
      : process.env.ELEVENLABS_MALE_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

  console.log(`🎙️ Selected ${normalizedGender} voice → ${voiceId}`);

  const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=pcm_22050`;

  const requestBody = {
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'audio/pcm',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.text();
    } catch {
      errorDetails = "Unable to read error body";
    }

    console.error("❌ ElevenLabs API ERROR:");
    console.error("Status:", response.status);
    console.error("Details:", errorDetails);

    // If voice requires paid plan, log a helpful message
    if (response.status === 402) {
      console.error(`⚠️ Voice ${voiceId} requires a paid ElevenLabs plan.`);
      console.error('💡 Use a premade voice instead. Available free female voices:');
      console.error('   Sarah: EXAVITQu4vr4xnSDxMaL');
      console.error('   Alice: Xb7hH8MSUJpSbSDYk0k2');
      console.error('   Lily:  pFZP5JQG7iQjIQuC4Bku');
    }

    console.warn('⚠️ Falling back to local Windows TTS...');
    return generateLocalVoice(text, normalizedGender);
  }


  const pcmBuffer = Buffer.from(await response.arrayBuffer());
  const wavBuffer = pcmToWav(pcmBuffer, 22050, 16, 1);

  fs.writeFileSync(SADTALKER_AUDIO_PATH, wavBuffer);

  console.log(`🎵 Audio saved to ${SADTALKER_AUDIO_PATH}`);

  return SADTALKER_AUDIO_PATH;
}

export default { generateVoice };

