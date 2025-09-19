import { Router } from 'express';
import { getAllServices, createService, getServiceById, updateService, deleteService } from '../controllers/service.controller';

const router = Router();

router.get('/', getAllServices);
router.post('/', createService);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
