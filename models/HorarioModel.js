import mongoose from 'mongoose';

const HorarioSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  diaSemana: { type: Number, required: true }, 
  aula: { type: Number, required: true },
  horario: { type: String, required: true },
  classeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classe', 
    required: true 
  }
}, { timestamps: true });

HorarioSchema.index({ usuarioId: 1, diaSemana: 1, aula: 1 }, { unique: true });

export default mongoose.model('Horario', HorarioSchema);