import html_to_pdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

const imagemParaBase64 = (caminhoFoto) => {
    try {
        if (!caminhoFoto) return null;
        const bitmap = fs.readFileSync(path.resolve(caminhoFoto));
        return `data:image/jpeg;base64,${Buffer.from(bitmap).toString('base64')}`;
    } catch (error) {
        return null;
    }
};

export const gerarPdfQuarto = async (quarto) => {
    const fotoBase64 = imagemParaBase64(quarto.foto);
    const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial; margin: 30px; }
                .foto { max-width: 300px; margin-bottom: 20px; border: 1px solid #ddd; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Detalhes do Quarto: ${quarto.nome}</h1>
            ${fotoBase64 ? `<img src="${fotoBase64}" class="foto" />` : '<p>Sem foto</p>'}
            <p><span class="label">ID:</span> ${quarto.id}</p>
            <p><span class="label">Categoria:</span> ${quarto.categoria}</p>
            <p><span class="label">Preço:</span> R$ ${Number(quarto.preco).toFixed(2)}</p>
            <p><span class="label">Disponível:</span> ${quarto.disponivel ? 'Sim' : 'Não'}</p>
            <p><span class="label">Descrição:</span> ${quarto.descricao || 'N/A'}</p>
        </body>
        </html>
    `;
    return await html_to_pdf.generatePdf({ content: html }, { format: 'A4' });
};

export const gerarPdfTodos = async (quartos) => {
    const linhas = quartos.map(q => `
        <tr>
            <td>${q.id}</td>
            <td>${q.nome}</td>
            <td>${q.categoria}</td>
            <td>R$ ${Number(q.preco).toFixed(2)}</td>
            <td>${q.disponivel ? 'Sim' : 'Não'}</td>
        </tr>
    `).join('');

    const html = `
        <html>
        <head>
            <style>
                body { font-family: Arial; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Relatório Geral de Quartos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Disponível</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas}
                </tbody>
            </table>
        </body>
        </html>
    `;
    return html_to_pdf.generatePdf({ content: html }, { format: 'A4' });
};