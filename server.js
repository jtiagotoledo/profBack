import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import fs from 'fs'; 

dotenv.config(); 

import authRoutes from './routes/authRoutes.js';
import anoRoutes from './routes/anoRoutes.js';
import classeRoutes from './routes/classeRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import testeRoutes from './routes/testeRoutes.js';
import pagamentosRoutes from './routes/pagamentosRoutes.js';
import horarioRoutes from './routes/horarioRoutes.js';

import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/anos', anoRoutes);      
app.use('/classes', classeRoutes); 
app.use('/alunos', alunoRoutes);
app.use('/pagamentos', pagamentosRoutes);
app.use('/horarios', horarioRoutes);
app.use('/teste', testeRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Assistente do Professor v2 rodando com sucesso!');
});

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});