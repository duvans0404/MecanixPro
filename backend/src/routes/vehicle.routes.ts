import { Router } from 'express';
import { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle } from '../controllers/vehicle.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all vehicles - accessible by all staff
router.get('/', isStaff, getAllVehicles);

// GET vehicle by ID - accessible by all staff
router.get('/:id', isStaff, getVehicleById);

// POST create vehicle - accessible by all staff
router.post('/', isStaff, createVehicle);

// PUT update vehicle - accessible by all staff
router.put('/:id', isStaff, updateVehicle);

// DELETE vehicle - only admin and manager
router.delete('/:id', isAdminOrManager, deleteVehicle);

export default router;
