import jwt from 'jsonwebtoken';

export const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const createSendToken = (user, statusCode, req, res) => {
    const token = gerarToken(user._id);
    
    user.senha = undefined; 

    res.status(statusCode).json({
        status: 'sucesso',
        token,
        data:{
            user,
        }
    });
};