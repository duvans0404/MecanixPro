import { Router } from 'express';
import { getAllWorkOrders, createWorkOrder, getWorkOrderById, updateWorkOrder, deleteWorkOrder } from '../controllers/work-order.controller';

const router = Router();

router.get('/', getAllWorkOrders);
router.post('/', createWorkOrder);
router.get('/:id', getWorkOrderById);
router.put('/:id', updateWorkOrder);
router.delete('/:id', deleteWorkOrder);

export default router;
