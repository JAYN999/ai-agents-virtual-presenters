# AI Presenter — User and Setup Manual

## 1. What the application does

AI Presenter turns a topic into a short talking-avatar video through the following backend steps:

1. Google Gemini (or optional OpenRouter fallback) generates a spoken script.
2. ElevenLabs generates speech audio. If no ElevenLabs key is configured, the current local fallback uses Windows Speech.
3. SadTalker uses the avatar image and audio to create a lip-synced video.
4. Whisper subtitle generation is attempted by the current SadTalker service; subtitle output can be unavailable if the local script or dependencies are missing.

## 2. Before running

Install Node.js, Python, Git, and SadTalker separately. SadTalker code, its Python environment and model checkpoints are not included in this repository. Install them using the SadTalker project's own instructions.

## 3. Backend configuration

Copy `backend/.env.example` to `backend/.env` and fill in:

- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY` (optional)
- `OPENROUTER_API_KEY` (optional fallback)
- `SADTALKER_PATH` (directory containing SadTalker's `inference.py`)
- `PORT` (defaults to 5000)

Never commit real API keys or the `.env` file.

## 4. Start the application

In one terminal:

```powershell
cd Aipresenter\Aipresenter\backend
npm install
npm run dev
```

In a second terminal:

```powershell
cd Aipresenter\Aipresenter\frontend
npm install
npm run dev
```

Open http://localhost:5173. The backend health endpoint is http://localhost:5000/health.

## 5. Use the application

1. Enter a topic.
2. Choose the male or female avatar, or upload an image.
3. Select Generate.
4. Wait while the backend generates the script, speech audio and video.
5. Watch the returned video. Subtitle output may be absent when local Whisper dependencies are unavailable.

Uploaded images are limited to 10 MB by the backend.

## 6. Troubleshooting

- Confirm `SADTALKER_PATH` points to a folder containing `inference.py`.
- Confirm the SadTalker Python virtual environment and model checkpoints are installed as required by SadTalker.
- Confirm your provider API keys and quota.
- If using the local speech fallback, run the backend on Windows with Windows Speech installed.
- Check the backend terminal for provider or SadTalker errors.
