import express from 'express';
import 'dotenv/config';
import hospedeRoutes from './routes/hospedeRoute.js';
import quartoRoutes from './routes/quartoRoute.js';
import pdfRoutes from './routes/pdfRoute.js';
import fotoRoutes from './routes/fotoRoute.js';
import autenticar from './utils/apiKey.js';
import docApiSwagger from 'express-jsdoc-swagger';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

docApiSwagger(app)({
    info: {
        title: 'Documentação API de Serviço de Hotéis',
        version: '1.0.0',
        description: 'Documentação da API de serviços de hotéis Swagger'
    },
    baseDir: import.meta.dirname,
    filesPattern: './**/*.js',
});

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/hospede', autenticar, hospedeRoutes);
app.use('/catalogo', pdfRoutes);
app.use('/quarto', quartoRoutes);
app.use('/catalogo', fotoRoutes);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
