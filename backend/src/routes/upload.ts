import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import authMiddleware from '../middleware/auth';
import fs from 'fs';

const router = express.Router();

// store temp files
const upload = multer({ dest: 'uploads/' });

// ✅ FIXED ROUTE (NO /upload here)
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'skincare',
      })
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map(result => result.secure_url);

    // ✅ delete temp files
    files.forEach(file => fs.unlinkSync(file.path));

    res.json({
      success: true,
      urls, // ✅ multiple images
    });

  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;