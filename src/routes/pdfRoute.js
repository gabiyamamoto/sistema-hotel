import express from 'express';
import * as controller from '../controllers/pdfController.js';

const router = express.Router();

router.get('/pdf', controller.relatorioGeral);
router.get('/:id/pdf', controller.relatorioIndividual);

export default router;