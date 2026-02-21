import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const uri = process.env.MONGO_URI_LOCAL;

async function connectDB() {
    try {
        await mongoose.connect(uri); 
        console.log('Conectado ao mongoDB local');
    } catch (e) {
        console.log('Erro ao conectar ao mongoDB local ', e);
        process.exit(1); 
    };
};

export default connectDB;