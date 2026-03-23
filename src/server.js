import express from 'express';
import 'dotenv/config';
import hospedeRoutes from './routes/hospedeRoute.js';
import quartoRoutes from './routes/quartoRoute.js';
import pdfRoutes from './routes/pdfRoute.js';
import fotoRoutes from './routes/fotoRoute.js';
import autenticar from './utils/apiKey.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/hospede', autenticar, hospedeRoutes);
app.use('/quarto', pdfRoutes);
app.use('/quarto', quartoRoutes);
app.use('/quarto', fotoRoutes);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
