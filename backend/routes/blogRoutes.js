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
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;
