import express from 'express';
import { getHorarios, saveHorario, deleteHorario } from '../controllers/horarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getHorarios);
router.post('/', saveHorario);
router.delete('/:id', deleteHorario);

export default router;