import mongoose from 'mongoose';

const AtividadeSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, 
  descricao: { type: String },
  materia: { type: String, default: 'Robótica' },
  dataCriacao: { type: Date, default: Date.now }
});

export default mongoose.model('Atividade', AtividadeSchema);