import { Router } from 'express';
import { getAllParts, createPart, getPartById, updatePart, deletePart } from '../controllers/part.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all parts - accessible by all staff
router.get('/', isStaff, getAllParts);

// GET part by ID - accessible by all staff
router.get('/:id', isStaff, getPartById);

// POST create part - only admin and manager
router.post('/', isAdminOrManager, createPart);

// PUT update part - only admin and manager
router.put('/:id', isAdminOrManager, updatePart);

// DELETE part - only admin and manager
router.delete('/:id', isAdminOrManager, deletePart);

export default router;
