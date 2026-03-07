import Classe from '../models/ClasseModel.js';
import Ano from '../models/AnoModel.js';

export const criarClasse = async (req, res) => {
    try {
        const { nome, anoLetivoId } = req.body;

        const anoExiste = await Ano.findOne({ 
            _id: anoLetivoId, 
            professor: req.user.id 
        });
        
        if (!anoExiste) {
            return res.status(404).json({
                status: 'falha',
                message: 'Ano letivo não encontrado ou permissão negada.'
            });
        }

        const novaClasse = await Classe.create({
            nome,
            anoLetivo: anoLetivoId,
            professor: req.user.id
        });

        res.status(201).json({
            status: 'sucesso',
            data: novaClasse
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'falha',
                message: 'Você já cadastrou uma turma com este nome para o ano selecionado.'
            });
        }

        res.status(400).json({
            status: 'falha',
            message: error.message
        });
    }
};

export const listarClassesPorAno = async (req, res) => {
    try {
        const { anoId } = req.params;

        const classes = await Classe.find({ 
            anoLetivo: anoId, 
            professor: req.user.id 
        }).sort('nome');

        res.status(200).json({
            status: 'sucesso',
            resultados: classes.length,
            data: classes
        });
    } catch (error) {
        res.status(400).json({
            status: 'falha',
            message: error.message
        });
    }
};