// ─────────────────────────────────────────────────────────────
// Load environment variables FIRST (ESM safe)
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

// ─────────────────────────────────────────────────────────────
// Resolve directory
// ─────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────
// Import routes AFTER dotenv is loaded
// ─────────────────────────────────────────────────────────────
import generateRouter from './routes/generate.js';

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// ✅ Use environment variable if provided
const SADTALKER_PATH =
    process.env.SADTALKER_PATH ||
    path.resolve(__dirname, 'AI/SadTalker-main/SadTalker-main');

const SADTALKER_RESULTS_PATH = path.join(SADTALKER_PATH, 'results');

// ─────────────────────────────────────────────────────────────
// Debug Info
// ─────────────────────────────────────────────────────────────
console.log('\n🔑 Environment Check:');
console.log('   Gemini API Key:', process.env.GEMINI_API_KEY ? 'Loaded ✓' : 'Missing ✗');
console.log('   ElevenLabs API Key:', process.env.ELEVENLABS_API_KEY ? 'Loaded ✓' : 'Missing ✗');
console.log('   SadTalker Path:', SADTALKER_PATH);

// ─────────────────────────────────────────────────────────────
// Initialize Express
// ─────────────────────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─────────────────────────────────────────────────────────────
// Static File Serving
// ─────────────────────────────────────────────────────────────

// Avatars
app.use('/avatars', express.static(path.join(__dirname, '../avatars')));

// Uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// SadTalker output videos (with proper MIME type for .vtt subtitle files)
app.use('/sadtalker-results', express.static(SADTALKER_RESULTS_PATH, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.vtt')) {
            res.setHeader('Content-Type', 'text/vtt');
        }
    }
}));

// Optional local results folder
app.use('/results', express.static(path.join(__dirname, '../results')));

// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────
app.use('/api', generateRouter);

// ─────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'AI Presenter Generator API is running',
        timestamp: new Date().toISOString()
    });
});

// ─────────────────────────────────────────────────────────────
// Error Handler
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('\n❌ Server Error:');
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ─────────────────────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n🚀 AI Presenter Server Started');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);

    console.log('\n🎬 Video Endpoints:');
    console.log(`👉 SadTalker Results: http://localhost:${PORT}/sadtalker-results`);
    console.log(`👉 Health Check: http://localhost:${PORT}/health\n`);
});

export default app;
