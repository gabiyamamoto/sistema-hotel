import express from 'express';
import * as controller from '../controllers/exemploController.js';

const router = express.Router();

router.post('/exemplos', controller.criar);
router.get('/exemplos', controller.buscarTodos);
router.get('/exemplos/:id', controller.buscarPorId);
router.put('/exemplos/:id', controller.atualizar);
router.delete('/exemplos/:id', controller.deletar);

export default router;