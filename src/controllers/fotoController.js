import QuartoModel from '../models/QuartoModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: 'Nenhuma foto enviada!' });
        }

        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ erro: 'O id enviado não é um número válido.' });

        const quarto = await QuartoModel.buscarPorId(Number(id));
        if (!quarto) {
            removerFoto(req.file.path);
            return res.status(404).json({ erro: 'Registro não encontrado.' });
        }

        if (quarto.foto) {
            await fs.unlink(quarto.foto).catch(() => {});
        }

        quarto.foto = await processarFoto(req.file.path);
        await quarto.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: quarto.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        res.status(500).json({ error: 'Erro interno ao salvar foto do quarto.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;


        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido!' });
        }

        const quarto = await QuartoModel.buscarPorId(parseInt(id));

        if (!quarto) {
            return res.status(404).json({ error: 'Quarto não encontrado!' });
        }

        if (!quarto.foto) {
            return res.status(400).json({ error: 'Este quarto não possui foto registrada.' });
        }

        res.status(200).redirect(quarto.foto); // mostra a foto
        // res.status(200).json(quarto.foto); // mostra URL

    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        res.status(500).json({ error: 'Erro ao buscar foto do quarto.' });
    }
};
