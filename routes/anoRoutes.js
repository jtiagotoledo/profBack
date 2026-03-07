import express from 'express';
import { criarAno, listarAnos, atualizarAno, deletarAno } from '../controllers/anoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); 

router.route('/')
    .post(criarAno)
    .get(listarAnos);

router.route('/:id')
    .patch(atualizarAno)
    .delete(deletarAno);

export default router;