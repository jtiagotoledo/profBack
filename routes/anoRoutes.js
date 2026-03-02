import express from 'express';
import { criarAno, listarAnos } from '../controllers/anoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); 

router.route('/')
    .post(criarAno)
    .get(listarAnos);

export default router;