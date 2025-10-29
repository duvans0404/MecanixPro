import { Router } from 'express';
import { getAllAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment } from '../controllers/appointment.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all appointments - accessible by all staff
router.get('/', isStaff, getAllAppointments);

// GET appointment by ID - accessible by all staff
router.get('/:id', isStaff, getAppointmentById);

// POST create appointment - accessible by all staff
router.post('/', isStaff, createAppointment);

// PUT update appointment - accessible by all staff
router.put('/:id', isStaff, updateAppointment);

// DELETE appointment - only admin and manager
router.delete('/:id', isAdminOrManager, deleteAppointment);

export default router;
