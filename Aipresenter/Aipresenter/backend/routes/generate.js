import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import { generateScript } from "../services/geminiService.js";
import { generateVoice } from "../services/elevenLabsService.js";
import {
  generateVideo,
  checkSadTalkerInstallation,
} from "../services/sadTalkerService.js";
import {
  ensureDirectoriesExist,
  copyImageToSadTalker,
} from "../utils/fileUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Unified SadTalker Path
const SADTALKER_PATH = path.resolve(__dirname, "../AI/SadTalker-main/SadTalker-main");
const SADTALKER_IMAGE_PATH = path.join(SADTALKER_PATH, "input.jpg");

// ===============================
// Multer Configuration
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    ensureDirectoriesExist();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ===============================
// POST /api/generate-video
// ===============================

router.post(
  "/generate-video",
  upload.single("image"),
  async (req, res) => {
    const sessionId = uuidv4();
    console.log(
      `\n📝 New Generation Request [Session: ${sessionId}]`
    );

    try {
      const { topic, avatar } = req.body;

      if (!topic || !topic.trim()) {
        return res.status(400).json({
          success: false,
          message: "Topic is required",
        });
      }

      // ===============================
      // SadTalker Installation Check
      // ===============================

      const sadStatus = checkSadTalkerInstallation();
      if (!sadStatus.installed) {
        return res.status(500).json({
          success: false,
          message: `SadTalker not available: ${sadStatus.message}`,
        });
      }

      // ===============================
      // Determine Avatar
      // ===============================

      let sourceImagePath;
      const voiceGender =
        avatar === "female" ? "female" : "male";

      if (req.file) {
        sourceImagePath = req.file.path;
        console.log("📷 Using uploaded image");
      } else {
        const avatarDir = path.join(
          __dirname,
          "../../avatars"
        );

        sourceImagePath = path.join(
          avatarDir,
          voiceGender === "female"
            ? "female.jpg"
            : "male.jpg"
        );

        if (!fs.existsSync(sourceImagePath)) {
          return res.status(400).json({
            success: false,
            message:
              "Default avatar image not found. Please upload one.",
          });
        }

        console.log("👤 Using default avatar");
      }

      // ===============================
      // Copy Image to SadTalker
      // ===============================

      console.log("📦 Copying image to SadTalker...");
      copyImageToSadTalker(
        sourceImagePath,
        SADTALKER_IMAGE_PATH
      );

      // ===============================
      // Step 1: Script Generation
      // ===============================

      console.log("🤖 Generating script...");
      const script = await generateScript(topic);
      console.log("✅ Script generated");

      // ===============================
      // Step 2: Voice Generation
      // ===============================

      console.log("🎙️ Generating voice...");
      const audioPath = await generateVoice(
        script,
        voiceGender,
        sessionId
      );
      console.log("✅ Voice generated");

      // ===============================
      // Step 3: Video + Subtitles
      // ===============================

      console.log("🎬 Running SadTalker...");
      const result = await generateVideo(
        SADTALKER_IMAGE_PATH,
        audioPath
      );

      const videoPath = result?.video;
      const subtitlePath = result?.subtitles;

      if (!videoPath || !fs.existsSync(videoPath)) {
        throw new Error(
          "Video generation finished but file not found"
        );
      }

      console.log("🎉 Video + Subtitles generated");

      // ===============================
      // Success Response
      // ===============================

      res.json({
        success: true,
        message: "Video generated successfully",
        data: {
          sessionId,
          videoPath,
          subtitlePath,
          videoUrl: `/sadtalker-results/${path.basename(
            videoPath
          )}`,
          subtitleUrl: subtitlePath
            ? `/sadtalker-results/${path.basename(
              subtitlePath
            )}`
            : null,
          scriptPreview:
            script.substring(0, 200) +
            (script.length > 200 ? "..." : ""),
        },
      });
    } catch (error) {
      console.error(
        "\n❌ Generation Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Internal Server Error",
      });
    }
  }
);

export default router;