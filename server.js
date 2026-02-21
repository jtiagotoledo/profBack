import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); 

import Atividade from './models/atividades.js';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Backend do Assistente do Professor v2 rodando com sucesso!');
});

app.post('/teste-inserir', async (req, res) => {
  try {
    const novaAtividade = new Atividade({
      titulo: "Teste de Conexão V2",
      descricao: "Inserindo documento no MongoDB via domínio DuckDNS",
      materia: "Programação"
    });

    const salvo = await novaAtividade.save(); 
    res.status(201).json({
      message: "Documento inserido com sucesso!",
      dados: salvo
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao inserir", erro: error.message });
  }
});

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});