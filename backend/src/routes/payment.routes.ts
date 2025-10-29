import { Router } from 'express';
import { getAllPayments, createPayment, getPaymentById, updatePayment, deletePayment } from '../controllers/payment.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all payments - accessible by all staff
router.get('/', isStaff, getAllPayments);

// GET payment by ID - accessible by all staff
router.get('/:id', isStaff, getPaymentById);

// POST create payment - accessible by all staff
router.post('/', isStaff, createPayment);

// PUT update payment - only admin and manager
router.put('/:id', isAdminOrManager, updatePayment);

// DELETE payment - only admin and manager
router.delete('/:id', isAdminOrManager, deletePayment);

export default router;
