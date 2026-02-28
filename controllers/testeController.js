import Teste from '../models/TesteModel.js';

export const testeInserir = async (req, res) => {
  try {
    const { titulo, descricao, materia } = req.body;

    const novoTeste = new Teste({
      titulo: titulo || "Teste de Conexão V2",
      descricao: descricao || "Inserindo documento no MongoDB via domínio DuckDNS",
      materia: materia || "Programação"
    });

    const salvo = await novoTeste.save();
    
    res.status(201).json({
      message: "Documento inserido com sucesso!",
      dados: salvo
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Erro ao inserir no MongoDB", 
      erro: error.message 
    });
  }
};