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

export const atualizarClasse = async (req, res) => {
    try {
        const { nome } = req.body;
        const classe = await Classe.findOneAndUpdate(
            { _id: req.params.id, professor: req.user.id },
            { nome },
            { new: true, runValidators: true }
        );

        if (!classe) return res.status(404).json({ status: 'falha', message: 'Classe não encontrada.' });

        res.status(200).json({ status: 'sucesso', data: classe });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const deletarClasse = async (req, res) => {
    try {
        const classe = await Classe.findOneAndDelete({ _id: req.params.id, professor: req.user.id });

        if (!classe) return res.status(404).json({ status: 'falha', message: 'Classe não encontrada.' });

        res.status(204).json({ status: 'sucesso', data: null });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};