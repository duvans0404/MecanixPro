import { Router } from 'express';
import { getAllInsurances, createInsurance, getInsuranceById, updateInsurance, deleteInsurance } from '../controllers/insurance.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all insurances - accessible by all staff
router.get('/', isStaff, getAllInsurances);

// GET insurance by ID - accessible by all staff
router.get('/:id', isStaff, getInsuranceById);

// POST create insurance - accessible by all staff
router.post('/', isStaff, createInsurance);

// PUT update insurance - accessible by all staff
router.put('/:id', isStaff, updateInsurance);

// DELETE insurance - only admin and manager
router.delete('/:id', isAdminOrManager, deleteInsurance);

export default router;
