import { Router } from 'express';
import { getAllParts, createPart, getPartById, updatePart, deletePart } from '../controllers/part.controller';

const router = Router();

router.get('/', getAllParts);
router.post('/', createPart);
router.get('/:id', getPartById);
router.put('/:id', updatePart);
router.delete('/:id', deletePart);

export default router;
