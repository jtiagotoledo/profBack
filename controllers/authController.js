import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/UserModel.js';
import { createSendToken } from '../utils/gerarTokenJwt.js';
import gerarTokenJwt from '../utils/gerarTokenJwt.js';
import User from '../models/UserModel.js';

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

export const gerarTokenDev = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Acesso negado. Rota disponível apenas para desenvolvimento.' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'O campo email é obrigatório.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Nenhum usuário encontrado com este email.' });
        }

        const token = gerarTokenJwt(user._id);

        res.json({
            message: 'Token de desenvolvimento gerado com sucesso.',
            token,
            user: {
                id: user._id,
                email: user.email,
                nome: user.nome
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar o token de teste.' });
    }
};

export const getMe = (req, res) => {
    res.status(200).json({
        status: 'sucesso',
        data: req.user 
    });
};

export const updateFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'falha',
                message: 'Nenhum ficheiro enviado. Selecione uma imagem.'
            });
        }

        const protocolo = req.headers['x-forwarded-proto'] || req.protocol;
        
        const urlBase = `${protocolo}://${req.get('host')}`;
        const fotoUrl = `${urlBase}/uploads/${req.file.filename}`;

        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            { fotoPerfil: fotoUrl },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'sucesso',
            message: 'Foto de perfil atualizada com sucesso!',
            fotoPerfil: user.fotoPerfil
        });

    } catch (error) {
        console.error("Erro ao atualizar foto de perfil:", error);
        res.status(500).json({
            status: 'falha',
            message: 'Erro interno ao tentar salvar a foto.'
        });
    }
};