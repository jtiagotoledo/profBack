import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/UserModel.js';
import { createSendToken } from '../utils/gerarTokenJwt.js';

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({
            status: 'falha',
            message: 'O idToken é obrigatório.'
        });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload.email_verified) {
            return res.status(401).json({
                status: 'falha',
                message: 'Este e-mail do Google não foi verificado.'
            });
        }

        const { sub, email, name, picture } = payload;

        const user = await UserModel.findOneAndUpdate(
            { googleId: sub }, 
            { 
                nome: name,
                email: email, 
                fotoPerfil: picture,
                ultimoLogin: Date.now() 
            },
            { 
                upsert: true, 
                new: true, 
                runValidators: true 
            }
        );

        createSendToken(user, 200, req, res);

    } catch (error) {
        console.error("Erro detalhado na autenticação Google:", error.message);
        res.status(401).json({
            status: 'falha',
            message: 'Token inválido ou expirado.'
        });
    }
};