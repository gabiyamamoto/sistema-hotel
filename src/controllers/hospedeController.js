import HospedeModel from '../models/HospedeModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, telefone, cep } = req.body;

        if (!nome) {
            return res.status(400).json({ error: "Campo obrigatório não informado." });
        }
        if (!email) {
            return res.status(400).json({ error: "Campo obrigatório não informado." });
        }
        if (!telefone) {
            return res.status(400).json({ error: "Campo obrigatório não informado." });
        }
        
        const hospede = new HospedeModel({ nome, email, telefone, cep });
        const data = await hospede.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(400).json({ error: error.message });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const filtros = req.query;
        const registros = await HospedeModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum hóspede encontrado.' });
        }

        return res.status(200).json({
            total: registros.length,
            message: 'Lista de hóspedes disponíveis',
            filtros,
            registros,
        });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(400).json({ error: error.message });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const hospede = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Hóspede não encontrado.' });
        }

        return res.status(200).json({ data: hospede });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(400).json({ error: error.message });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const hospedeExistente = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospedeExistente) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const hospede = new HospedeModel({
            id: parseInt(id),
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            cep: req.body.cep,
            ativo: req.body.ativo
        })

        const data = await hospede.atualizar();

        return res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(400).json({ error: error.message });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const hospede = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await hospede.deletar();

        return res.status(200).json({ message: `O registro "${hospede.nome}" foi deletado com sucesso!`, deletado: hospede });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(400).json({ error: error.message });
    }
};