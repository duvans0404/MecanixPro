import { Router } from 'express';
import { getAllWorkOrderParts, createWorkOrderPart, getWorkOrderPartById, updateWorkOrderPart, deleteWorkOrderPart } from '../controllers/work-order-part.controller';
import { authenticate, isMechanicOrHigher } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and mechanic role or higher
router.use(authenticate);
router.use(isMechanicOrHigher);

router.get('/', getAllWorkOrderParts);
router.post('/', createWorkOrderPart);
router.get('/:id', getWorkOrderPartById);
router.put('/:id', updateWorkOrderPart);
router.delete('/:id', deleteWorkOrderPart);

export default router;
