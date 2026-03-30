import QuartoModel from '../models/QuartoModel.js';
import { gerarPdfQuarto, gerarPdfTodos } from '../utils/pdfHelper.js';

export const relatorioIndividual = async (req, res) => {
    try {
        const { id } = req.params;
        const quarto = await QuartoModel.buscarPorId(parseInt(id));

        if (!quarto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdfBuffer = await gerarPdfQuarto(quarto);

        if (!pdfBuffer) {
            throw new Error('Falha ao gerar buffer do PDF');
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="quarto_${id}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        return res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error(`[PDF Error]: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao gerar o PDF.' });
    }
};

export const relatorioGeral = async (req, res) => {
    try {
        const quartos = await QuartoModel.buscarTodos();

        if (!quartos || quartos.length === 0) {
            return res.status(404).json({ error: 'Nenhum registro encontrado.' });
        }

        const pdfBuffer = await gerarPdfTodos(quartos);

        if (!pdfBuffer) {
            throw new Error('Falha ao gerar buffer do relatório');
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="relatorio_geral.pdf"',
            'Content-Length': pdfBuffer.length
        });

        return res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error(`[PDF Error Geral]: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao gerar o relatório.' });
    }
};
