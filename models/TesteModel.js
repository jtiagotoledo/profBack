import mongoose from 'mongoose';

const TesteSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, 
  descricao: { type: String },
  materia: { type: String, default: 'Robótica' },
  dataCriacao: { type: Date, default: Date.now }
});

export default mongoose.model('Teste', TesteSchema);