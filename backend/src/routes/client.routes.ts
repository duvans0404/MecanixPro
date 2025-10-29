import { Router } from 'express';
import { getAllClients, createClient, getClientById, updateClient, deleteClient } from '../controllers/client.controller';
import { authenticate, isStaff, isAdminOrManager } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET all clients - accessible by all staff
router.get('/', isStaff, getAllClients);

// GET client by ID - accessible by all staff
router.get('/:id', isStaff, getClientById);

// POST create client - accessible by all staff
router.post('/', isStaff, createClient);

// PUT update client - accessible by all staff
router.put('/:id', isStaff, updateClient);

// DELETE client - only admin and manager
router.delete('/:id', isAdminOrManager, deleteClient);

export default router;
