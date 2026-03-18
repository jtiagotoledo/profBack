import express from 'express';
import { criarAluno, listarAlunosPorClasse, registrarFrequencia, 
    atualizarAluno, deletarAluno, lancarNota, lancarNotasEmLote } from '../controllers/alunoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', criarAluno);
router.post('/notas-em-lote', lancarNotasEmLote);
router.get('/classe/:classeId', listarAlunosPorClasse);
router.patch('/:id/nota', lancarNota);
router.patch('/:id/frequencia', registrarFrequencia);

router.route('/:id')
    .patch(atualizarAluno) 
    .delete(deletarAluno);

export default router;