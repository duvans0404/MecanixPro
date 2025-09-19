import { Router } from 'express';
import { getAllInsurances, createInsurance, getInsuranceById, updateInsurance, deleteInsurance } from '../controllers/insurance.controller';

const router = Router();

router.get('/', getAllInsurances);
router.post('/', createInsurance);
router.get('/:id', getInsuranceById);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

export default router;
