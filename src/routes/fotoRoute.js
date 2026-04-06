import express from 'express';
import * as controller from '../controllers/fotoController.js';
import { upload } from '../utils/fotoHelper.js'

const router = express.Router();

router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);
router.get('/:id/foto', controller.verFoto);

export default router;
