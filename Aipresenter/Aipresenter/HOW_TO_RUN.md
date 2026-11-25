# How to Run AI Presenter (Windows)

This guide matches the current repository layout and code.

## 1. Prerequisites

- Node.js 18 or later
- Python and Git
- A separately installed SadTalker checkout, including `inference.py`, dependencies and model checkpoints
- Gemini API key
- Optional ElevenLabs API key

## 2. Install SadTalker separately

The SadTalker source and model files are not stored in this Git repository. For example:

```powershell
cd C:\
git clone https://github.com/OpenTalker/SadTalker.git
```

Follow SadTalker's own instructions to install the required Python packages and model checkpoints. Confirm `C:\SadTalker\inference.py` exists.

## 3. Configure the backend

Open `Aipresenter\Aipresenter\backend` and copy the example file:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set your own values:

```env
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=
ELEVENLABS_API_KEY=your_elevenlabs_key
SADTALKER_PATH=C:/SadTalker
PORT=5000
NODE_ENV=development
```

Keep the real `.env` private and do not upload it to GitHub.

## 4. Install and start the backend

```powershell
cd Aipresenter\Aipresenter\backend
npm install
npm run dev
```

The API should be available at http://localhost:5000. Check http://localhost:5000/health.

## 5. Install and start the frontend

Open a second terminal:

```powershell
cd Aipresenter\Aipresenter\frontend
npm install
npm run dev
```

Open http://localhost:5173.

## 6. Generate a video

1. Enter a topic.
2. Select an avatar or upload an image (maximum 10 MB).
3. Select Generate.
4. The backend requests a script, creates voice audio, then runs SadTalker.
5. Watch the resulting video when generation completes.

## Troubleshooting

- **SadTalker not found:** Check that `SADTALKER_PATH` points to the directory containing `inference.py`.
- **Gemini errors:** Check `GEMINI_API_KEY` and provider quota.
- **OpenRouter fallback:** Set `OPENROUTER_API_KEY` if you want the optional fallback.
- **ElevenLabs errors:** Check your API key and voice IDs. Without an ElevenLabs key, the current local fallback uses Windows Speech.
- **CUDA errors:** Install a PyTorch build compatible with your installed driver, or test SadTalker in CPU mode.
- **Port in use:** Change `PORT` in the backend `.env` and update the Vite proxy target in `frontend/vite.config.js` to match.
