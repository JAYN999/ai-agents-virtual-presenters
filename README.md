# 🎬 AI Presenter Generator

A production-ready web application that generates AI-powered presentation videos with lip-sync technology. Enter any topic, select an avatar, and get a professional video presentation generated automatically.

## ✨ Features

- **AI Script Generation**: Uses Google Gemini AI to create engaging 2-minute presentation scripts
- **Voice Synthesis**: Generates natural-sounding voiceovers using ElevenLabs API
- **Lip-Sync Videos**: Creates realistic talking head videos using SadTalker
- **Custom Avatars**: Upload your own image or choose from default male/female avatars
- **Dark Theme UI**: Modern, professional, responsive design

## 📁 Project Structure

```
Aipresenter/
├── frontend/                # React.js (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS styles
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js Express backend
│   ├── routes/
│   │   └── generate.js      # API routes
│   ├── services/
│   │   ├── geminiService.js     # Google Gemini integration
│   │   ├── elevenLabsService.js # ElevenLabs integration
│   │   └── sadTalkerService.js  # SadTalker integration
│   ├── utils/
│   │   └── fileUtils.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── avatars/                 # Default avatar images
│   ├── male.jpg
│   └── female.jpg
│
├── uploads/                 # User-uploaded images
│
├── results/                 # Generated videos and audio
│
└── README.md
```

## 🛠️ Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **Python** (v3.8 - 3.10 recommended)
   - Download: https://www.python.org/

3. **Git**
   - Download: https://git-scm.com/

4. **CUDA Toolkit** (for GPU acceleration with SadTalker)
   - Download: https://developer.nvidia.com/cuda-downloads

### API Keys Required

1. **Google Gemini API Key**
   - Get it from: https://makersuite.google.com/app/apikey

2. **ElevenLabs API Key**
   - Get it from: https://elevenlabs.io/ (sign up and go to Profile Settings)

## 📦 Installation

### Step 1: Clone or Navigate to the Project

```bash
cd Aipresenter
```

### Step 2: Install SadTalker

```bash
# Clone SadTalker repository (outside the project folder)
cd C:/
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker

# Create a virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# Download pretrained models (will take some time)
# Models will be downloaded automatically on first run, or download manually:
# - Download checkpoints from: https://github.com/OpenTalker/SadTalker#-2-download-models
# - Place in SadTalker/checkpoints/ folder
```

### Step 3: Install Backend Dependencies

```bash
cd Aipresenter/backend

# Install npm packages
npm install
```

### Step 4: Configure Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your API keys
notepad .env
```

Configure your `.env` file:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_actual_gemini_api_key

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key

# ElevenLabs Voice IDs (default voices, can be changed)
ELEVENLABS_MALE_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVENLABS_FEMALE_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Path to SadTalker installation
SADTALKER_PATH=C:/SadTalker

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 5: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 6: Add Avatar Images

Add default avatar images to the `avatars` folder:

- `avatars/male.jpg` - Default male avatar (512x512 recommended)
- `avatars/female.jpg` - Default female avatar (512x512 recommended)

You can use any high-quality face images. For best results:

- Use clear, front-facing photos
- Good lighting
- Neutral expression
- Square aspect ratio (512x512 or larger)

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Production Mode

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

## 📝 API Documentation

### POST /api/generate

Generate an AI presentation video.

**Request:**

- Content-Type: `multipart/form-data`

| Field      | Type   | Required | Description                                    |
| ---------- | ------ | -------- | ---------------------------------------------- |
| topic      | string | Yes      | Topic for the presentation                     |
| avatarType | string | Yes      | "male" or "female"                             |
| image      | file   | No       | Custom avatar image (JPG, PNG, WebP, max 10MB) |

**Response:**

```json
{
  "success": true,
  "message": "Video generated successfully",
  "data": {
    "sessionId": "uuid",
    "videoUrl": "/results/uuid/output.mp4",
    "script": "Generated script preview..."
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "sessionId": "uuid"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "message": "AI Presenter Generator API is running"
}
```

## 🔧 Troubleshooting

### Common Issues

**1. SadTalker not found**

- Ensure `SADTALKER_PATH` in `.env` points to the correct directory
- Verify `inference.py` exists in the SadTalker folder

**2. CUDA errors**

- Install the correct CUDA toolkit version for your GPU
- Use `torch` with CPU if no GPU: remove `--index-url` flag when installing

**3. ElevenLabs quota exceeded**

- Free tier has limited characters/month
- Upgrade your ElevenLabs plan or wait for quota reset

**4. Gemini API errors**

- Verify your API key is correct
- Check if you've exceeded free tier limits

**5. Video not generating**

- Check backend console for detailed error messages
- Ensure all Python dependencies are installed in SadTalker environment

### Logs

Check the backend console for detailed logs:

```
📝 New generation request [Session: xxx]
🤖 Step 1: Generating script with Gemini AI...
✅ Script generated (300 characters)
🎙️ Step 2: Generating voice with ElevenLabs...
✅ Voice generated: /results/xxx/voice.mp3
🎬 Step 3: Generating lip-sync video with SadTalker...
✅ Video generated: /results/xxx/output.mp4
🎉 Generation complete! [Session: xxx]
```

## 📚 Required Packages

### Backend (npm)

```json
{
  "@google/generative-ai": "^0.21.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.21.0",
  "multer": "^1.4.5-lts.1",
  "uuid": "^10.0.0",
  "nodemon": "^3.1.4"
}
```

### Frontend (npm)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@vitejs/plugin-react": "^4.3.1",
  "vite": "^5.4.2"
}
```

### SadTalker (pip)

```txt
torch>=1.12.1
torchvision>=0.13.1
torchaudio>=0.12.1
numpy
scipy
face_alignment
dlib
librosa
pydub
imageio
imageio-ffmpeg
yacs
pyyaml
safetensors
gfpgan
basicsr
facexlib
realesrgan
piqa
tqdm
```

## 🔐 Security Notes

- Never commit `.env` files with real API keys
- Implement rate limiting for production
- Add authentication for public deployments
- Sanitize user inputs
- Set appropriate file size limits

## 📄 License

All rights reserved. This repository and its code are for personal portfolio review and viewing purposes only. No permission is granted to copy, modify, distribute, or use this code for any other purpose.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ❓ Support

For issues and questions:

- Check the troubleshooting section
- Review console logs for errors
- Ensure all dependencies are installed correctly
