import express from 'express';
import upload from '../middleware/multer.js';
import { compare } from '../controllers/compareController.js';

const router = express.Router();

// Accept form-data with fields 'resume' and optional 'jd'
router.post('/compare', upload.fields([{ name: 'resume' }, { name: 'jd' }]), compare);

export default router;
