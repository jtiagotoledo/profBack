import Aluno from '../models/AlunoModel.js';

export const criarAluno = async (req, res) => {
    try {
        const { nome, numeroChamada, classeId } = req.body;

        const novoAluno = await Aluno.create({
            nome,
            numeroChamada,
            classe: classeId,
            professor: req.user.id
        });

        res.status(201).json({ status: 'sucesso', data: novoAluno });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'falha', message: 'Este número de chamada já existe nesta classe.' });
        }
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const listarAlunosPorClasse = async (req, res) => {
    try {
        const alunos = await Aluno.find({ 
            classe: req.params.classeId, 
            professor: req.user.id 
        }).sort('numeroChamada');

        res.status(200).json({ status: 'sucesso', resultados: alunos.length, data: alunos });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const lancarNota = async (req, res) => {
    try {
        const { titulo, valor, peso } = req.body;

        const aluno = await Aluno.findOneAndUpdate(
            { _id: req.params.id, professor: req.user.id },
            { $push: { notas: { titulo, valor, peso } } },
            { new: true, runValidators: true }
        );

        if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado.' });

        res.status(200).json({ status: 'sucesso', data: aluno });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const registrarFrequencia = async (req, res) => {
    try {
        const { data, presente } = req.body;

        const aluno = await Aluno.findOneAndUpdate(
            { _id: req.params.id, professor: req.user.id },
            { $push: { frequencias: { data, presente } } },
            { new: true }
        );

        res.status(200).json({ status: 'sucesso', data: aluno });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};