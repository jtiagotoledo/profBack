import Ano from '../models/AnoModel.js';

export const criarAno = async (req, res) => {
    try {
        const { rotulo } = req.body;

        const novoAno = await Ano.create({
            rotulo,
            professor: req.user.id 
        });

        res.status(201).json({
            status: 'sucesso',
            data: novoAno
        });
    } catch (error) {
        // Erro de índice duplicado (professor tentando criar o mesmo ano duas vezes)
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'falha',
                message: 'Você já cadastrou este ano letivo.'
            });
        }

        res.status(400).json({
            status: 'falha',
            message: error.message
        });
    }
};

export const listarAnos = async (req, res) => {
    try {
        const anos = await Ano.find({ professor: req.user.id }).sort('-rotulo');

        res.status(200).json({
            status: 'sucesso',
            resultados: anos.length,
            data: anos
        });
    } catch (error) {
        res.status(400).json({
            status: 'falha',
            message: error.message
        });
    }
};