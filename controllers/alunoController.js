import Aluno from '../models/AlunoModel.js';
import Classe from '../models/ClasseModel.js';

export const criarAluno = async (req, res) => {
    try {
        const { nome, numeroChamada, classeId, ativo } = req.body; 

        const novoAluno = await Aluno.create({
            nome,
            numeroChamada,
            classe: classeId, 
            professor: req.user.id,
            ativo: ativo !== undefined ? ativo : true 
        });

        res.status(201).json({ status: 'sucesso', data: novoAluno });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                status: 'falha', 
                message: 'Este número de chamada já existe nesta classe.' 
            });
        }
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const listarAlunosPorClasse = async (req, res) => {
    try {
        const alunos = await Aluno.find({ 
            classe: req.params.classeId, 
            professor: req.user.id 
        })
        .populate({ path: 'classe', select: 'diasLetivos' }) 
        .sort('numeroChamada');

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
        const alunoId = req.params.id;

        let aluno = await Aluno.findOneAndUpdate(
            { _id: alunoId, professor: req.user.id, "frequencias.data": data },
            { $set: { "frequencias.$.presente": presente } },
            { new: true, runValidators: true }
        );

        if (!aluno) {
            aluno = await Aluno.findOneAndUpdate(
                { _id: alunoId, professor: req.user.id },
                { $push: { frequencias: { data, presente } } },
                { new: true, runValidators: true }
            );
        }

        if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado.' });

        await Classe.findByIdAndUpdate(aluno.classe, {
            $addToSet: { diasLetivos: data }
        });

        const alunoPopulado = await Aluno.findById(aluno._id).populate('classe', 'diasLetivos');

        res.status(200).json({ status: 'sucesso', data: alunoPopulado });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const atualizarAluno = async (req, res) => {
    try {
        const { nome, numeroChamada, ativo } = req.body;
        
        const aluno = await Aluno.findOneAndUpdate(
            { _id: req.params.id, professor: req.user.id },
            { nome, numeroChamada, ativo },
            { new: true, runValidators: true }
        );

        if (!aluno) return res.status(404).json({ status: 'falha', message: 'Aluno não encontrado.' });

        res.status(200).json({ status: 'sucesso', data: aluno });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const deletarAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findOneAndDelete({ _id: req.params.id, professor: req.user.id });

        if (!aluno) return res.status(404).json({ status: 'falha', message: 'Aluno não encontrado.' });

        res.status(204).json({ status: 'sucesso', data: null });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};