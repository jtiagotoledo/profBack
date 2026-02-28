import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um e-mail válido.']
    },
    googleId: {
        type: String,
        unique: true,
        required: [true, 'O Google ID é obrigatório para este método de login.'],
    },
    fotoPerfil: {
        type: String,
        default: '', 
    },
    ultimoLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

UserSchema.index({ email: 1 });

export default mongoose.model('User', UserSchema);