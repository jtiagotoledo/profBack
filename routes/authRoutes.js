import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middlewares/authMiddleware.js';
import { googleLogin, getMe, updateFoto } from '../controllers/authController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        cb(null, `perfil-${req.user.id}-${Date.now()}${extensao}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/me', protect, getMe);
router.post('/google', googleLogin);
router.patch('/foto', protect, upload.single('foto'), updateFoto);

export default router;