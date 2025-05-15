import express from 'express';
import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getBlogs).post(protect, createBlog);
router.route('/:id').put(protect, updateBlog).delete(protect, deleteBlog);
router.post('/upload-image', protect, upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    console.log('❌ Image upload failed: no file or file.path');
    return res.status(400).json({ msg: 'Image upload failed' });
  }

  res.status(200).json({ imageUrl: req.file.path });
});

export default router;
