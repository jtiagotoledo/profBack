import express from 'express';
import { criarClasse, listarClassesPorAno, atualizarClasse, deletarClasse } from '../controllers/classeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', criarClasse);
router.get('/ano/:anoId', listarClassesPorAno);

router.route('/:id')
    .patch(atualizarClasse)
    .delete(deletarClasse);

export default router;