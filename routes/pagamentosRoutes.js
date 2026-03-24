import express from 'express';
import { verificarPagamento } from '../controllers/pagamentosController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/verificar', protect, verificarPagamento);

export default router;