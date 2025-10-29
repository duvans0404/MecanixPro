import { Router } from 'express';
import { getAllMechanics, createMechanic, getMechanicById, updateMechanic, deleteMechanic } from '../controllers/mechanic.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all mechanics - accessible by all staff
router.get('/', isStaff, getAllMechanics);

// GET mechanic by ID - accessible by all staff
router.get('/:id', isStaff, getMechanicById);

// POST create mechanic - only admin and manager
router.post('/', isAdminOrManager, createMechanic);

// PUT update mechanic - only admin and manager
router.put('/:id', isAdminOrManager, updateMechanic);

// DELETE mechanic - only admin and manager
router.delete('/:id', isAdminOrManager, deleteMechanic);

export default router;
