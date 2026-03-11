import mongoose from 'mongoose';

const NotaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    valor: { type: Number, required: true, min: 0, max: 10 },
    peso: { type: Number, default: 1 },
    dataLancamento: { type: Date, default: Date.now }
});

const FrequenciaSchema = new mongoose.Schema({
    data: { type: String, required: true }, 
    presente: { type: Boolean, default: true },
}, { _id: false });

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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

AlunoSchema.virtual('media').get(function() {
    if (!this.notas || this.notas.length === 0) return 0;
    
    const soma = this.notas.reduce((acc, nota) => acc + nota.valor, 0);
    return soma / this.notas.length;
});

AlunoSchema.virtual('frequenciaPorcentagem').get(function() {
    if (!this.classe || !this.classe.diasLetivos || this.classe.diasLetivos.length === 0) {
        return 100;
    }

    const totalDiasAula = this.classe.diasLetivos.length;
    const totalFaltas = this.frequencias.filter(f => f.presente === false).length;
    
    const presencas = totalDiasAula - totalFaltas;
    const calculo = (presencas / totalDiasAula) * 100;

    return Math.round(calculo < 0 ? 0 : calculo);
});

AlunoSchema.index({ numeroChamada: 1, classe: 1 }, { unique: true });

export default mongoose.model('Aluno', AlunoSchema);