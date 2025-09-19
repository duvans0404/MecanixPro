import { Router } from 'express';
import { getAllMechanics, createMechanic, getMechanicById, updateMechanic, deleteMechanic } from '../controllers/mechanic.controller';

const router = Router();

router.get('/', getAllMechanics);
router.post('/', createMechanic);
router.get('/:id', getMechanicById);
router.put('/:id', updateMechanic);
router.delete('/:id', deleteMechanic);

export default router;
