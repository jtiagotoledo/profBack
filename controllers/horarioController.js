import Horario from '../models/HorarioModel.js';

export const getHorarios = async (req, res) => {
    try {
        const horarios = await Horario.find({ usuarioId: req.usuarioId })
                                      .populate('classeId'); 
        res.json(horarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a grade de horários.' });
    }
};

export const saveHorario = async (req, res) => {
    const { diaSemana, aula, horario, classeId } = req.body;

    try {
        const horarioSalvo = await Horario.findOneAndUpdate(
            { usuarioId: req.usuarioId, diaSemana, aula }, 
            { horario, classeId },                         
            { new: true, upsert: true }                    
        ).populate('classeId');

        res.json(horarioSalvo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o horário.' });
    }
};

export const deleteHorario = async (req, res) => {
    const { id } = req.params;
    
    try {
        await Horario.findOneAndDelete({ _id: id, usuarioId: req.usuarioId });
        res.json({ message: 'Horário removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o horário.' });
    }
};