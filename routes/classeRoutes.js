import express from 'express';
import { criarClasse, listarClassesPorAno, atualizarClasse, 
    deletarClasse, confirmarPresencaTotal, confirmarProva, atualizarTituloProva } from '../controllers/classeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', criarClasse);
router.get('/ano/:anoId', listarClassesPorAno);
router.patch('/confirmar-dia', confirmarPresencaTotal);
router.patch('/confirmar-prova', confirmarProva);

router.route('/:id')
    .patch(atualizarClasse)
    .delete(deletarClasse);

export default router;