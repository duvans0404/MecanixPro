import { Router } from 'express';
import { getAllWorkOrderServices, createWorkOrderService, getWorkOrderServiceById, updateWorkOrderService, deleteWorkOrderService } from '../controllers/work-order-service.controller';

const router = Router();

router.get('/', getAllWorkOrderServices);
router.post('/', createWorkOrderService);
router.get('/:id', getWorkOrderServiceById);
router.put('/:id', updateWorkOrderService);
router.delete('/:id', deleteWorkOrderService);

export default router;
