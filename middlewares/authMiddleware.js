import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            status: 'falha',
            message: 'Você não está logado! Por favor, faça login para acessar.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                status: 'falha',
                message: 'O usuário dono deste token não existe mais.'
            });
        }

        req.user = currentUser;
        next(); 

    } catch (error) {
        return res.status(401).json({
            status: 'falha',
            message: 'Token inválido ou expirado.'
        });
    }
};