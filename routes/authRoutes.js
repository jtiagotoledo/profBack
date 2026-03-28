import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { googleLogin, getMe } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/google', googleLogin);

export default router;
