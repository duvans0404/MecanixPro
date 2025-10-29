import { Router } from 'express';
import { getAllWorkOrderServices, createWorkOrderService, getWorkOrderServiceById, updateWorkOrderService, deleteWorkOrderService } from '../controllers/work-order-service.controller';
import { authenticate, isMechanicOrHigher } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and mechanic role or higher
router.use(authenticate);
router.use(isMechanicOrHigher);

router.get('/', getAllWorkOrderServices);
router.post('/', createWorkOrderService);
router.get('/:id', getWorkOrderServiceById);
router.put('/:id', updateWorkOrderService);
router.delete('/:id', deleteWorkOrderService);

export default router;
