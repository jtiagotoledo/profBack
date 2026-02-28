import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); 

import authRoutes from './routes/authRoutes.js';
import testeRoutes from './routes/testeRoutes.js';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/auth', authRoutes);
app.use('/teste', testeRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Assistente do Professor v2 rodando com sucesso!');
});

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});