import { Router } from 'express';
import { getAllAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment } from '../controllers/appointment.controller';

const router = Router();

router.get('/', getAllAppointments);
router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
