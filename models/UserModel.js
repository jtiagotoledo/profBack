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
        match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um e-mail válido.']
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
    },
    isPremium: { 
        type: Boolean, 
        default: false,
        index: true 
    },
    purchaseToken: { 
        type: String,
        unique: true,
        sparse: true   
    },
    productId: { type: String },    
    dataPagamento: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);