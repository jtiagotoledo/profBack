import express from 'express';
import { getHorarios, saveHorario, deleteHorario } from '../controllers/horarioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getHorarios);
router.post('/', saveHorario);
router.delete('/:id', deleteHorario);

export default router;