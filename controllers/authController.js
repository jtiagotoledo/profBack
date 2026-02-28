import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/UserModel.js'


const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;
        console.log('idToken',sub, email, name, picture);

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                nome: name,
                email: email,
                googleId: sub, 
                fotoPerfil: picture,
                perfilCompleto: false
            });
        }

        createSendToken(user, 200, req, res);

    } catch (error) {
        console.error("Erro na autenticação Google:", error);
        res.status(401).json({
            status: 'falha',
            message: 'A autenticação com o Google falhou ou o token é inválido.'
        });
    }
};