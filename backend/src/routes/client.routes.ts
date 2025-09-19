import { Router } from 'express';
import { getAllClients, createClient, getClientById, updateClient, deleteClient } from '../controllers/client.controller';

const router = Router();

router.get('/', getAllClients);
router.post('/', createClient);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
