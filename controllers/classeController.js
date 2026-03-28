import Classe from '../models/ClasseModel.js';
import Ano from '../models/AnoModel.js';

export const criarClasse = async (req, res) => {
    try {
        const { nome, anoLetivoId } = req.body;
        const userId = req.user.id;

        console.log("ID do Professor no Token:", userId);

        const totalClasses = await Classe.countDocuments({ professor: userId });
        if (!req.user.isPremium && totalClasses >= 1) {
            return res.status(403).json({
                status: 'falha',
                message: 'Limite de 1 turma atingido. Assine o Premium para criar turmas ilimitadas!'
            });
        }

        console.log("Total de classes encontradas para este ID:", totalClasses);

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
        console.error("ERRO NO CONTROLLER DE CLASSE:", error);
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

export const confirmarPresencaTotal = async (req, res) => {
    try {
        const { classeId, data, conteudo } = req.body;

        const classe = await Classe.findOne({ _id: classeId, "diasLetivos.data": data });

        if (classe) {
            await Classe.updateOne(
                { _id: classeId, "diasLetivos.data": data },
                { $set: { "diasLetivos.$.conteudo": conteudo || "" } }
            );
        } else {
            await Classe.findByIdAndUpdate(classeId, {
                $push: { 
                    diasLetivos: { 
                        data: data, 
                        conteudo: conteudo || "" 
                    } 
                }
            });
        }

        res.status(200).json({ status: 'sucesso', message: 'Registro atualizado.' });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const atualizarConteudoAula = async (req, res) => {
    try {
        const { classeId, data, conteudo } = req.body;

        const classe = await Classe.findOneAndUpdate(
            { 
                _id: classeId, 
                professor: req.user.id,
                "diasLetivos.data": data 
            },
            { $set: { "diasLetivos.$.conteudo": conteudo } },
            { new: true, runValidators: true }
        );

        if (!classe) {
            return res.status(404).json({ 
                status: 'falha', 
                message: 'Dia letivo não encontrado para esta turma.' 
            });
        }

        res.status(200).json({ status: 'sucesso', data: classe });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
    }
};

export const confirmarProva = async (req, res) => {
    try {
        const { classeId, data, titulo } = req.body;

        const classe = await Classe.findOne({ 
            _id: classeId, 
            professor: req.user.id, 
            "diasProvas.data": data 
        });

        if (classe) {
            await Classe.updateOne(
                { _id: classeId, "diasProvas.data": data },
                { $set: { "diasProvas.$.titulo": titulo || "Nova Avaliação" } }
            );
        } else {
            await Classe.findByIdAndUpdate(classeId, {
                $push: { 
                    diasProvas: { data, titulo: titulo || "Nova Avaliação" } 
                }
            });
        }

        res.status(200).json({ status: 'sucesso', message: 'Calendário de avaliações atualizado.' });
    } catch (error) {
        res.status(400).json({ status: 'falha', message: error.message });
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