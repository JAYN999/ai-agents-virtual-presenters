# 🎬 AI Presenter — Setup & User Manual

Welcome to the **AI Presenter**! This guide walks you through setting up and running the AI-powered presentation video generator.

---

## 📝 1. Prerequisites

Install the following before you begin:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.8 – 3.10 | [python.org](https://www.python.org/) |
| **CUDA Toolkit** | (Optional — for NVIDIA GPU) | [nvidia.com](https://developer.nvidia.com/cuda-downloads) |

> **Important:** During Node.js installation, make sure **"Add to PATH"** is checked.
> During Python installation, make sure **"Add Python to PATH"** is checked.

### 🔑 Required API Keys
| Service | Purpose | Get it from |
|---------|---------|-------------|
| **Google Gemini** | Script generation | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| **ElevenLabs** | Voice synthesis | [elevenlabs.io](https://elevenlabs.io/) |

---

## ⚙️ 2. Step-by-Step Installation

### Step A: Extract/Download the Project

Extract the project zip or clone it. You should have a folder structure like:
```
Aipresenter/
├── backend/
│   ├── AI/
│   │   └── SadTalker-main/SadTalker-main/   ← SadTalker is bundled here
│   ├── services/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── avatars/
├── uploads/
└── results/
```

> **Note:** SadTalker is already included inside `backend/AI/`. You do NOT need to clone it separately.

---

### Step B: Set Up SadTalker Python Environment

SadTalker needs a Python virtual environment with PyTorch installed.

1. Open a terminal (PowerShell or Command Prompt)
2. Navigate to the SadTalker folder:
   ```powershell
   cd path\to\Aipresenter\backend\AI\SadTalker-main\SadTalker-main
   ```
3. Create a Python virtual environment:
   ```powershell
   python -m venv venv
   ```
4. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
5. Install PyTorch:

   **If you have an NVIDIA GPU:**
   ```powershell
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```
   **If you do NOT have a GPU (CPU only):**
   ```powershell
   pip install torch torchvision torchaudio
   ```

6. Install SadTalker dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

7. (Optional) Install Whisper for subtitle generation:
   ```powershell
   pip install openai-whisper
   ```

> **Tip:** The AI model checkpoints should already be in the `checkpoints/` folder. If not, they will auto-download on first run.

---

### Step C: Set Up the Backend (Node.js)

1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd path\to\Aipresenter\backend
   ```
2. Install Node.js dependencies:
   ```powershell
   npm install
   ```
3. Edit the `.env` file with your API keys:
   ```env
   # Google Gemini API Key
   GEMINI_API_KEY=paste_your_gemini_key_here

   # ElevenLabs API Key
   ELEVENLABS_API_KEY=paste_your_elevenlabs_key_here

   # Voice IDs (defaults are fine)
   ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB
   ELEVENLABS_FEMALE_VOICE_ID=21m00Tcm4TlvDq8ikWAM

   # Server
   PORT=5000
   NODE_ENV=development
   ```

> **Note:** You do NOT need to set `SADTALKER_PATH` — it auto-detects the bundled SadTalker.

---

### Step D: Set Up the Frontend (React/Vite)

1. Open a terminal and navigate to the frontend folder:
   ```powershell
   cd path\to\Aipresenter\frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```

---

## 🚀 3. How to Run the Application

You need **two terminal windows** — one for backend, one for frontend.

### Terminal 1 — Start Backend
```powershell
cd path\to\Aipresenter\backend
npm run dev
```
✅ You should see:
```
🚀 AI Presenter Server Started
📍 URL: http://localhost:5000
```

### Terminal 2 — Start Frontend
```powershell
cd path\to\Aipresenter\frontend
npm run dev
```
✅ You should see:
```
VITE ready in XXX ms
➜  Local: http://localhost:5173/
```

### Open the App
Open your browser and go to: **http://localhost:5173**

---

## 🎥 4. Using the AI Presenter

1. Open **http://localhost:5173** in your browser
2. **Enter a Topic** — e.g., "The History of AI", "Benefits of Exercise"
3. **Select an Avatar** — Male, Female, or upload your own image
   - Best results: 512×512 square, front-facing, good lighting, neutral expression
4. Click **Generate Video**
5. Wait 2–5 minutes while the system:
   - 🤖 Generates a script (Gemini AI)
   - 🎙️ Creates a voiceover (ElevenLabs)
   - 🎬 Renders lip-sync video (SadTalker)
6. Watch, download, or share your video!

---

## 🛑 5. Troubleshooting

### "npm is not recognized"
→ Node.js is not installed or not in PATH. Reinstall Node.js and check "Add to PATH" during installation. **Restart your terminal** after installing.

### "python is not recognized"
→ Python is not installed or not in PATH. Reinstall Python and check "Add Python to PATH". **Restart your terminal**.

### "EADDRINUSE: address already in use :::5000"
→ Another process is using port 5000. Kill it:
```powershell
# Find and kill the process on port 5000
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
Then run `npm run dev` again.

### "SadTalker not available: Python venv not found"
→ You haven't set up the SadTalker Python environment. Follow **Step B** above.

### Video generation fails / crashes immediately
→ Check if you installed the correct PyTorch version:
- **With NVIDIA GPU:** Use the `cu118` version
- **Without GPU:** Use the CPU version (no `--index-url` flag)

### "CUDA out of memory"
→ Close other GPU-intensive apps. Or try adding `--size 256` (already set by default).

### API quota errors
→ Free tiers have limits. Check your Gemini and ElevenLabs dashboards for remaining quota.

### ElevenLabs fails → Falls back to Windows TTS
→ This is normal if the API key is invalid or quota exceeded. The app will use Windows built-in text-to-speech as a fallback.
