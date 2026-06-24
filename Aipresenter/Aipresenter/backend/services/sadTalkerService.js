import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SADTALKER_PATH = path.resolve(__dirname, "../AI/SadTalker-main/SadTalker-main");

export function checkSadTalkerInstallation() {
  const pythonPath = path.join(SADTALKER_PATH, "venv", "Scripts", "python.exe");
  const inferencePath = path.join(SADTALKER_PATH, "inference.py");

  return {
    installed: fs.existsSync(pythonPath) && fs.existsSync(inferencePath),
    message: !fs.existsSync(pythonPath)
      ? "Python venv not found"
      : !fs.existsSync(inferencePath)
        ? "inference.py not found"
        : "Ready",
    path: SADTALKER_PATH,
  };
}

export function generateVideo(imagePath, audioPath) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(
      SADTALKER_PATH,
      "venv",
      "Scripts",
      "python.exe"
    );

    const resultDir = path.join(SADTALKER_PATH, "results");

    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir, { recursive: true });
    }

    console.log("\n🎬 Starting SadTalker...");

    const sadtalkerProcess = spawn(
      pythonPath,
      [
        "inference.py",
        "--driven_audio",
        path.resolve(audioPath),
        "--source_image",
        path.resolve(imagePath),
        "--result_dir",
        resultDir,
        "--still",
        "--preprocess",
        "crop",
        "--size",
        "256",
      ],
      { cwd: SADTALKER_PATH }
    );

    let errorOutput = "";

    sadtalkerProcess.stdout.on("data", (data) => {
      console.log(`[SadTalker] ${data.toString()}`);
    });

    sadtalkerProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    sadtalkerProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`SadTalker exited with code ${code}\n${errorOutput}`)
        );
      }

      // 🔍 Find newest video
      const files = fs
        .readdirSync(resultDir)
        .filter((f) => f.endsWith(".mp4"))
        .map((f) => ({
          name: f,
          time: fs.statSync(path.join(resultDir, f)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length === 0) {
        return reject(new Error("Video generated but no mp4 found."));
      }

      const finalVideoPath = path.join(resultDir, files[0].name);

      // 🎤 Step 2: Generate Subtitles using Whisper
      console.log("📝 Generating subtitles with Whisper...");

      // Whisper names output as <audio_basename>.vtt
      const audioBaseName = path.basename(audioPath, path.extname(audioPath));
      const subtitlePath = path.join(resultDir, `${audioBaseName}.vtt`);

      const whisperProcess = spawn(
        pythonPath,
        [
          "generate_subtitles.py",
          path.resolve(audioPath),
          resultDir,
          "base",
        ],
        { cwd: SADTALKER_PATH }
      );

      whisperProcess.stdout.on("data", (data) => {
        console.log(`[Whisper] ${data.toString()}`);
      });

      whisperProcess.stderr.on("data", (data) => {
        console.log(`[Whisper] ${data.toString()}`);
      });

      whisperProcess.on("close", (whisperCode) => {
        if (whisperCode !== 0 || !fs.existsSync(subtitlePath)) {
          console.warn("⚠️ Subtitle generation failed.");
          return resolve({
            video: finalVideoPath,
            subtitles: null,
          });
        }

        console.log("✅ Subtitles generated.");

        resolve({
          video: finalVideoPath,
          subtitles: subtitlePath,
        });
      });
    });
  });
}