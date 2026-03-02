import express from 'express';
import { criarClasse, listarClassesPorAno } from '../controllers/classeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', criarClasse);
router.get('/ano/:anoId', listarClassesPorAno);

export default router;