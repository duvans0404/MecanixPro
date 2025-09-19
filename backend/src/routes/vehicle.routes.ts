import { Router } from 'express';
import { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle } from '../controllers/vehicle.controller';

const router = Router();

router.get('/', getAllVehicles);
router.post('/', createVehicle);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
