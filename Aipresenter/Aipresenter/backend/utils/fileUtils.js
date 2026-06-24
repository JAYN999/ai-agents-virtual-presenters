import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensure all required directories exist
 */
export function ensureDirectoriesExist() {
  const directories = [
    path.join(__dirname, '../../avatars'),
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../results')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

/**
 * Clean up old files from a directory
 * @param {string} directory - Directory to clean
 * @param {number} maxAgeHours - Maximum age of files in hours
 */
export function cleanupOldFiles(directory, maxAgeHours = 24) {
  if (!fs.existsSync(directory)) {
    return;
  }

  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;

  const items = fs.readdirSync(directory);
  
  items.forEach(item => {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(itemPath);
      }
      console.log(`🗑️ Cleaned up old file: ${item}`);
    }
  });
}

/**
 * Get file size in human-readable format
 * @param {string} filePath - Path to the file
 * @returns {string} - Human-readable file size
 */
export function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return 'File not found';
  }

  const stats = fs.statSync(filePath);
  const bytes = stats.size;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Check if a file is an image
 * @param {string} filename - Filename to check
 * @returns {boolean}
 */
export function isImage(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Check if a file is a video
 * @param {string} filename - Filename to check
 * @returns {boolean}
 */
export function isVideo(filename) {
  const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];
  const ext = path.extname(filename).toLowerCase();
  return videoExtensions.includes(ext);
}

/**
 * Check if a file is an audio file
 * @param {string} filename - Filename to check
 * @returns {boolean}
 */
export function isAudio(filename) {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
  const ext = path.extname(filename).toLowerCase();
  return audioExtensions.includes(ext);
}

/**
 * Copy and convert image to SadTalker input format (JPG)
 * @param {string} sourcePath - Path to source image
 * @param {string} destPath - Destination path (C:/SadTalker/input.jpg)
 */
export function copyImageToSadTalker(sourcePath, destPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy the image file
  fs.copyFileSync(sourcePath, destPath);
  console.log(`📷 Image copied: ${sourcePath} -> ${destPath}`);
}

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} - File extension in lowercase
 */
export function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Validate that SadTalker directories exist
 * @param {string} sadTalkerPath - Path to SadTalker installation
 */
export function validateSadTalkerPaths(sadTalkerPath = 'C:/SadTalker') {
  const requiredPaths = [
    sadTalkerPath,
    path.join(sadTalkerPath, 'inference.py')
  ];

  for (const p of requiredPaths) {
    if (!fs.existsSync(p)) {
      throw new Error(`Required SadTalker path not found: ${p}`);
    }
  }

  // Ensure results directory exists
  const resultsDir = path.join(sadTalkerPath, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  return true;
}

export default {
  ensureDirectoriesExist,
  cleanupOldFiles,
  getFileSize,
  isImage,
  isVideo,
  isAudio,
  copyImageToSadTalker,
  getExtension,
  validateSadTalkerPaths
};
