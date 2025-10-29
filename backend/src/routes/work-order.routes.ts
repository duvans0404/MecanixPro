import { Router } from 'express';
import { getAllWorkOrders, createWorkOrder, getWorkOrderById, updateWorkOrder, deleteWorkOrder } from '../controllers/work-order.controller';
import { authenticate, isStaff, isMechanicOrHigher, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all work orders - accessible by all staff
router.get('/', isStaff, getAllWorkOrders);

// GET work order by ID - accessible by all staff
router.get('/:id', isStaff, getWorkOrderById);

// POST create work order - accessible by mechanics and higher
router.post('/', isMechanicOrHigher, createWorkOrder);

// PUT update work order - accessible by mechanics and higher
router.put('/:id', isMechanicOrHigher, updateWorkOrder);

// DELETE work order - only admin and manager
router.delete('/:id', isAdminOrManager, deleteWorkOrder);

export default router;
