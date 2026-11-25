# AI Presenter

AI Presenter is a web application prototype that generates a short talking-avatar presentation from a topic. The current implementation combines a React/Vite frontend with a Node.js/Express backend and external AI services.

## What it does

1. Accepts a topic and an avatar choice or uploaded image.
2. Requests a short spoken script from Google Gemini (with an optional OpenRouter fallback).
3. Generates speech with ElevenLabs, or uses Windows local text-to-speech when the ElevenLabs key is not configured.
4. Runs SadTalker to render a lip-synced video.
5. Optionally generates subtitle text with Whisper when the relevant script and dependencies are available.

This repository does not include the SadTalker model checkout or pretrained model files. Install SadTalker separately and configure its location.

## Technology

- **Frontend:** JavaScript, React 18, Vite, CSS
- **Backend:** JavaScript, Node.js, Express
- **AI script generation:** Google Gemini API; optional OpenRouter fallback
- **Voice generation:** ElevenLabs API; Windows Speech fallback
- **Avatar video generation:** SadTalker (Python/PyTorch)
- **Optional subtitles:** Whisper

## Repository layout

The application files are under `Aipresenter/Aipresenter/`:

- `backend/server.js`: Express server and static file hosting
- `backend/routes/generate.js`: video-generation API route
- `backend/services/`: Gemini, ElevenLabs and SadTalker integrations
- `frontend/src/`: React app and UI components
- `HOW_TO_RUN.md` and `USER_MANUAL.md`: setup and usage guides

## Requirements

- Node.js 18 or later
- Python version compatible with the separately installed SadTalker checkout
- Git
- A working SadTalker installation with its Python environment and model checkpoints
- Google Gemini API key
- ElevenLabs API key (optional; without it, the current local voice fallback requires Windows)

GPU acceleration is optional but can substantially improve video-generation time. Install a PyTorch build compatible with the local GPU driver and SadTalker requirements.

## Configure and run (Windows-oriented setup)

1. Clone this repository.
2. Open the application folder:
   ```powershell
   cd Aipresenter\Aipresenter
   ```
3. Install SadTalker separately, for example:
   ```powershell
   cd C:\
   git clone https://github.com/OpenTalker/SadTalker.git
   ```
   Confirm that the cloned folder contains `inference.py` and install its documented dependencies and checkpoints.
4. In `backend`, copy `.env.example` to `.env` and set your keys and local SadTalker path:
   ```env
   GEMINI_API_KEY=your_gemini_key
   OPENROUTER_API_KEY=
   ELEVENLABS_API_KEY=your_elevenlabs_key
   ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB
   ELEVENLABS_FEMALE_VOICE_ID=EXAVITQu4vr4xnSDxMaL
   SADTALKER_PATH=C:/SadTalker
   PORT=5000
   NODE_ENV=development
   ```
   Never commit your real `.env` file or API keys.
5. Install and start the backend:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
6. In another terminal, install and start the frontend:
   ```powershell
   cd Aipresenter\Aipresenter\frontend
   npm install
   npm run dev
   ```
7. Open http://localhost:5173.

## API

### `POST /api/generate-video`

Content type: `multipart/form-data`

| Field | Required | Description |
|---|---|---|
| `topic` | Yes | Topic for script generation |
| `avatar` | No | `male` or `female`; defaults to male behavior |
| `image` | No | Uploaded avatar image, maximum 10 MB |

A successful response contains `data.videoUrl`, `data.subtitleUrl` (which can be null), and `data.scriptPreview`. The application also exposes `GET /health`.

## Notes and known limitations

- This is a learning/portfolio project, not a production-ready service.
- The current generation flow uses shared SadTalker input filenames, so simultaneous requests are not safe.
- Before public deployment, add authentication, rate limiting, CSRF/request controls as appropriate, per-request isolated work directories, stronger upload content validation, cleanup policies, and production-safe error handling.
- Do not expose provider API keys in frontend code or commit them to Git.
- Local Windows text-to-speech is a fallback, not a cross-platform service.

## License

All rights reserved. This repository and its code are for personal portfolio review and viewing purposes only.
