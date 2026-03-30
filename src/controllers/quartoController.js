import QuartoModel from '../models/QuartoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, categoria, preco } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O nome do quarto é obrigatório.' });
        }
        if (!categoria){
            return res.status(400).json({ error: 'O quarto deve ter uma categoria.' });
        }
        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O quarto deve ter um preço.' });
        }

        const quarto = new QuartoModel({ nome, categoria, preco: parseFloat(preco) });
        const data = await quarto.criar();

        return res.status(201).json({ message: 'Quarto registrado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao registrar quarto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro de quarto.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const quartos = await QuartoModel.buscarTodos(req.query);

        if (!quartos || quartos.length === 0) {
            return res.status(200).json({ message: 'Nenhum quarto encontrado.' });
        }

        return res.json(quartos);
    } catch (error) {
        console.error('Erro ao buscar quarto:', error);
        return res.status(500).json({ error: 'Erro ao buscar os quartos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const quarto = await QuartoModel.buscarPorId(parseInt(id));

        if (!quarto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.json({ data: quarto });
    } catch (error) {
        console.error('Erro ao buscar o quarto:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro do quarto.' });
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

        const quarto = await QuartoModel.buscarPorId(parseInt(id));

        if (!quarto) {
            return res.status(404).json({ error: 'Quarto não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            quarto.nome = req.body.nome;
        }
        if (req.body.categoria !== undefined) {
            quarto.categoria = req.body.categoria;
        }
        if (req.body.preco !== undefined) {
            quarto.preco = parseFloat(req.body.preco);
        }

        const data = await quarto.atualizar();

        return res.json({ message: `O quarto "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const quarto = await QuartoModel.buscarPorId(parseInt(id));

        if (!quarto) {
            return res.status(404).json({ error: 'Quarto não encontrado para deletar.' });
        }

        await quarto.deletar();

        return res.json({ message: `O quarto "${quarto.nome}" foi deletado com sucesso!`, deletado: quarto });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar quarto.' });
    }
};
