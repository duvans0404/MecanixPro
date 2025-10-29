import { Router } from 'express';
import { getAllServices, createService, getServiceById, updateService, deleteService } from '../controllers/service.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all services - accessible by all staff
router.get('/', isStaff, getAllServices);

// GET service by ID - accessible by all staff
router.get('/:id', isStaff, getServiceById);

// POST create service - only admin and manager
router.post('/', isAdminOrManager, createService);

// PUT update service - only admin and manager
router.put('/:id', isAdminOrManager, updateService);

// DELETE service - only admin and manager
router.delete('/:id', isAdminOrManager, deleteService);

export default router;
