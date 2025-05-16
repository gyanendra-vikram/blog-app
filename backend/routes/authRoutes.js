import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('name');
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.status(200).json(user);
});

export default router;
