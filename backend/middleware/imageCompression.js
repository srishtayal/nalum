const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/**
 * Middleware to compress images after upload using sharp
 * Automatically converts to WebP format for optimal compression
 * 
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 800)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 800)
 * @param {number} options.quality - WebP quality 1-100 (default: 80)
 * @param {boolean} options.maintainAspectRatio - Keep original aspect ratio (default: true)
 * @param {string} options.format - Output format: 'webp', 'jpeg', 'png' (default: 'webp')
 */
const compressImage = (options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 80,
    maintainAspectRatio = true,
    format = 'webp'
  } = options;

  return async (req, res, next) => {
    // Skip if no file was uploaded
    if (!req.file && (!req.files || req.files.length === 0)) {
      return next();
    }

    // Handle single file upload
    if (req.file) {
      await compressSingleFile(req.file, { maxWidth, maxHeight, quality, maintainAspectRatio, format }, req, res);
    }

    // Handle multiple file uploads
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await compressSingleFile(req.files[i], { maxWidth, maxHeight, quality, maintainAspectRatio, format }, req, res);
      }
    }

    next();
  };
};

/**
 * Helper function to compress a single file
 */
async function compressSingleFile(file, options, req, res) {
  const { maxWidth, maxHeight, quality, maintainAspectRatio, format } = options;
  
  const originalPath = file.path;
  const parsedPath = path.parse(originalPath);
  const compressedFilename = `${parsedPath.name}.${format}`;
  const compressedPath = path.join(parsedPath.dir, compressedFilename);

  try {
    console.log(`[ImageCompression] Starting compression for: ${file.filename}`);
    const startTime = Date.now();

    // Get original file size
    const originalStats = fs.statSync(originalPath);
    const originalSize = originalStats.size;

    // Create sharp instance and resize
    let transformer = sharp(originalPath);

    // Get image metadata
    const metadata = await transformer.metadata();
    
    // Resize if image is larger than max dimensions
    const needsResize = metadata.width > maxWidth || metadata.height > maxHeight;
    
    if (needsResize) {
      const resizeOptions = {
        fit: maintainAspectRatio ? 'inside' : 'cover',
        withoutEnlargement: true
      };
      transformer = transformer.resize(maxWidth, maxHeight, resizeOptions);
    }

    // Apply format-specific compression
    switch (format) {
      case 'webp':
        transformer = transformer.webp({ quality });
        break;
      case 'jpeg':
      case 'jpg':
        transformer = transformer.jpeg({ quality, progressive: true });
        break;
      case 'png':
        transformer = transformer.png({ quality, compressionLevel: 9 });
        break;
      default:
        transformer = transformer.webp({ quality });
    }

    // Save compressed image
    await transformer.toFile(compressedPath);

    // Get compressed file size
    const compressedStats = fs.statSync(compressedPath);
    const compressedSize = compressedStats.size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    // Delete original file
    fs.unlinkSync(originalPath);

    // Update file object with new compressed file info
    file.filename = compressedFilename;
    file.path = compressedPath;
    file.size = compressedSize;
    file.originalSize = originalSize;
    file.compressionRatio = compressionRatio;

    const processingTime = Date.now() - startTime;
    console.log(
      `[ImageCompression] Compressed ${file.originalname}: ` +
      `${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB ` +
      `(${compressionRatio}% reduction) in ${processingTime}ms`
    );
  } catch (error) {
    console.error("[ImageCompression] Compression failed:", error);
    
    // If compression fails, try to keep the original file
    if (fs.existsSync(originalPath)) {
      // Clean up compressed file if it was partially created
      if (fs.existsSync(compressedPath)) {
        try {
          fs.unlinkSync(compressedPath);
        } catch (cleanupError) {
          console.error("[ImageCompression] Cleanup error:", cleanupError);
        }
      }
      
      // Continue with original file
      console.log("[ImageCompression] Continuing with original file");
    } else {
      // Original file was deleted and compression failed
      throw new Error(`Image compression failed: ${error.message}`);
    }
  }
}

/**
 * Pre-configured compression presets for different use cases
 */
const compressionPresets = {
  // Profile pictures: small, optimized for web display
  profilePicture: compressImage({
    maxWidth: 500,
    maxHeight: 500,
    quality: 85,
    format: 'webp'
  }),

  // Post images: medium size, good quality
  postImage: compressImage({
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
    format: 'webp'
  }),

  // Event images: larger, higher quality
  eventImage: compressImage({
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: 'webp'
  }),

  // Thumbnails: very small, lower quality acceptable
  thumbnail: compressImage({
    maxWidth: 200,
    maxHeight: 200,
    quality: 75,
    format: 'webp'
  }),

  // High quality: minimal compression
  highQuality: compressImage({
    maxWidth: 2560,
    maxHeight: 2560,
    quality: 90,
    format: 'webp'
  })
};

module.exports = { compressImage, compressionPresets };
