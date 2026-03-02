import mongoose from 'mongoose';

const AnoSchema = new mongoose.Schema({
    rotulo: { 
        type: String, 
        required: [true, 'O rótulo do ano (ex: 2026) é obrigatório.'],
        trim: true 
    },
    professor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Um ano deve pertencer a um professor.'] 
    },
    isAtual: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true 
});

AnoSchema.index({ rotulo: 1, professor: 1 }, { unique: true });

export default mongoose.model('Ano', AnoSchema);