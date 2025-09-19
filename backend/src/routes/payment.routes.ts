import { Router } from 'express';
import { getAllPayments, createPayment, getPaymentById, updatePayment, deletePayment } from '../controllers/payment.controller';

const router = Router();

router.get('/', getAllPayments);
router.post('/', createPayment);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
