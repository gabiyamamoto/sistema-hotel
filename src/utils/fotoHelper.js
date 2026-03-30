import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const processarFoto = async (buffer, nomeArquivo) => {
    const nomeFormatado = `${Date.now()}-${nomeArquivo.replace(/\s/g, '-')}.jpg`;
    const caminhoCompleto = path.join('uploads', nomeFormatado);

    
    if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
    }

    await sharp(buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(caminhoCompleto);

    return caminhoCompleto;
};