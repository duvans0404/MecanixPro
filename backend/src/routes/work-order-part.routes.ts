import { Router } from 'express';
import { getAllWorkOrderParts, createWorkOrderPart, getWorkOrderPartById, updateWorkOrderPart, deleteWorkOrderPart } from '../controllers/work-order-part.controller';

const router = Router();

router.get('/', getAllWorkOrderParts);
router.post('/', createWorkOrderPart);
router.get('/:id', getWorkOrderPartById);
router.put('/:id', updateWorkOrderPart);
router.delete('/:id', deleteWorkOrderPart);

export default router;
