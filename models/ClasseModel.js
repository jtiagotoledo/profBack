import mongoose from 'mongoose';

const ClasseSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, 'O nome da turma (ex: 9º Ano A) é obrigatório.'],
        trim: true 
    },
    periodo: { 
        type: String, 
        enum: {
            values: ['Manhã', 'Tarde', 'Noite'],
            message: '{VALUE} não é um período válido.'
        },
        required: [true, 'O período é obrigatório.']
    },
    anoLetivo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ano', 
        required: [true, 'A turma deve pertencer a um ano letivo.'] 
    },
    professor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'A turma deve pertencer a um professor.'] 
    }
}, { 
    timestamps: true 
});

ClasseSchema.index({ nome: 1, anoLetivo: 1, professor: 1 }, { unique: true });

export default mongoose.model('Classe', ClasseSchema);