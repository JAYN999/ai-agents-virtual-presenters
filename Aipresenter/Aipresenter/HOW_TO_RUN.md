# 🚀 How to Run AI Presenter — Simple Step-by-Step Guide

---

## 📋 What You Need First (Prerequisites)

| # | Software | Download Link | Why? |
|---|----------|--------------|------|
| 1 | **Node.js** (v18+) | https://nodejs.org/ | Runs the backend & frontend |
| 2 | **Python** (3.8 – 3.10) | https://www.python.org/ | Runs SadTalker (video AI) |
| 3 | **Git** | https://git-scm.com/ | For cloning repos |
| 4 | **NVIDIA GPU + CUDA Toolkit** *(optional)* | https://developer.nvidia.com/cuda-downloads | Speeds up video generation |

### 🔑 API Keys You Need

| API | Where to Get It | What It Does |
|-----|----------------|--------------|
| **Google Gemini** | https://makersuite.google.com/app/apikey | Generates the script |
| **OpenRouter** *(optional fallback)* | https://openrouter.ai | Backup if Gemini quota runs out |
| **ElevenLabs** | https://elevenlabs.io → Profile Settings | Generates the voice |

---

## ⚡ Quick Start (5 Steps)

### Step 1️⃣ — Set Up Your API Keys

1. Open the file: `backend/.env`
2. Replace the placeholder keys with your own:

```env
GEMINI_API_KEY=paste_your_gemini_key_here
OPENROUTER_API_KEY=paste_your_openrouter_key_here
ELEVENLABS_API_KEY=paste_your_elevenlabs_key_here
```

> [!TIP]
> If you don't have an ElevenLabs key, the app will automatically fall back to Windows built-in text-to-speech.

---

### Step 2️⃣ — Set Up SadTalker (Video AI)

SadTalker is already included in the project at `backend/AI/SadTalker-main/SadTalker-main/`.

You need to create a Python virtual environment and install dependencies:

```powershell
# Navigate to the SadTalker folder
cd "path\to\Aipresenter\backend\AI\SadTalker-main\SadTalker-main"

# Create virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate

# Install PyTorch with GPU support (pick ONE):

# 👉 If you have an NVIDIA GPU:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

# 👉 If you DON'T have an NVIDIA GPU (CPU only):
pip install torch torchvision torchaudio

# Install remaining dependencies
pip install -r requirements.txt

# Deactivate when done
deactivate
```

> [!IMPORTANT]
> **First run will be slow** — SadTalker automatically downloads model checkpoints (~1-2 GB) on the first run. This only happens once.

---

### Step 3️⃣ — Install Backend Dependencies

Open a **new terminal** and run:

```powershell
cd "path\to\Aipresenter\backend"
npm install
```

---

### Step 4️⃣ — Install Frontend Dependencies

Open **another terminal** and run:

```powershell
cd "path\to\Aipresenter\frontend"
npm install
```

---

### Step 5️⃣ — Start the App! 🎉

You need **two terminals running at the same time**:

#### Terminal 1 — Start Backend Server:

```powershell
cd "path\to\Aipresenter\backend"
npm run dev
```

You should see: `Server running on http://localhost:5000`

#### Terminal 2 — Start Frontend:

```powershell
cd "path\to\Aipresenter\frontend"
npm run dev
```

You should see: `Local: http://localhost:5173`

#### ✅ Open in Browser:

👉 Go to **http://localhost:5173**

---

## 🎬 How to Use the App

1. **Enter a topic** (e.g., "Climate Change", "History of AI")
2. **Choose an avatar** — Male or Female, or upload your own photo
3. **Click Generate** 
4. **Wait** — the app will:
   - 🤖 Generate a script using AI
   - 🎙️ Create a voiceover
   - 🎬 Generate a lip-synced video
5. **Watch your video!** 🎉

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `GEMINI_API_KEY` error | Check your API key in `backend/.env` |
| Gemini quota exceeded | Add an `OPENROUTER_API_KEY` as fallback |
| ElevenLabs error | App auto-falls back to Windows TTS |
| SadTalker not found | Make sure the `venv` was created inside `backend/AI/SadTalker-main/SadTalker-main/` |
| Video generation is slow | Normal! First run downloads models. GPU makes it faster. |
| CUDA / GPU errors | Make sure CUDA Toolkit is installed, or use CPU-only PyTorch |
| Port already in use | Change `PORT` in `backend/.env` or kill the process using that port |

---

## 📁 Project Structure (Simplified)

```
Aipresenter/
├── backend/                    ← Node.js Express server (port 5000)
│   ├── .env                    ← YOUR API KEYS GO HERE
│   ├── server.js               ← Main server
│   ├── services/
│   │   ├── geminiService.js    ← Script generation (Gemini/OpenRouter)
│   │   ├── elevenLabsService.js← Voice generation (ElevenLabs/Windows TTS)
│   │   └── sadTalkerService.js ← Video generation (SadTalker)
│   └── AI/SadTalker-main/      ← SadTalker (Python AI for lip-sync)
│
├── frontend/                   ← React + Vite UI (port 5173)
├── avatars/                    ← Default face images (male.jpg, female.jpg)
├── results/                    ← Generated videos go here
└── uploads/                    ← User-uploaded images
```

---

## 📌 Summary Cheat Sheet

```
1. Edit  backend/.env          → Add your API keys
2. Run   pip install ...       → Set up SadTalker Python venv
3. Run   npm install           → In both backend/ and frontend/
4. Run   npm run dev           → In backend/ (Terminal 1)
5. Run   npm run dev           → In frontend/ (Terminal 2)
6. Open  http://localhost:5173 → Use the app!
```

**That's it! You're ready to go! 🎉**
