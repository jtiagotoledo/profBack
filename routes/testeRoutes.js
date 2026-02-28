import express from 'express';
import { testeInserir } from '../controllers/testeController.js';

const router = express.Router();

router.post('/inserir', testeInserir);

export default router;