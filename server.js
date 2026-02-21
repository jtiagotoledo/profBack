import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); 

import connectDB from './config/db.js';

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Backend do Assistente do Professor v2 rodando com sucesso!');
});

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});