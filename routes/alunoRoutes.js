import express from 'express';
import { criarAluno, listarAlunosPorClasse, lancarNota, registrarFrequencia, atualizarAluno, deletarAluno } from '../controllers/alunoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', criarAluno);
router.get('/classe/:classeId', listarAlunosPorClasse);
router.patch('/:id/nota', lancarNota);
router.patch('/:id/frequencia', registrarFrequencia);

router.route('/:id')
    .patch(atualizarAluno) 
    .delete(deletarAluno);

export default router;