import mongoose from 'mongoose';

const NotaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    valor: { type: Number, required: true, min: 0, max: 10 },
    peso: { type: Number, default: 1 },
    dataLancamento: { type: Date, default: Date.now }
});

const FrequenciaSchema = new mongoose.Schema({
    data: { type: Date, required: true },
    presente: { type: Boolean, default: true },
});

const AlunoSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, 'O nome do aluno é obrigatório.'],
        trim: true 
    },
    numeroChamada: { 
        type: Number,
        required: [true, 'O número da chamada é obrigatório.']
    },
    ativo: {
        type: Boolean,
        default: true, 
        required: true
    },
    classe: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Classe', 
        required: true 
    },
    professor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    notas: [NotaSchema],
    frequencias: [FrequenciaSchema]
}, { 
    timestamps: true 
});

AlunoSchema.index({ numeroChamada: 1, classe: 1 }, { unique: true });

export default mongoose.model('Aluno', AlunoSchema);