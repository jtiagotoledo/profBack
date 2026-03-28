import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', protect, (req, res) => {
    res.status(200).json({
        status: 'sucesso',
        data: req.user 
    });
});
router.post('/google', googleLogin);

export default router;
