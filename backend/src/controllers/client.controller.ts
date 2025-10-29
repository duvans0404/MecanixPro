import { Request, Response } from 'express';
import { Client } from '../models/client.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching clients' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating client' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching client' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    const { changes, changedKeys } = getChangedFields(client, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', client });
    }
    await client.update(changes);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error updating client' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    await client.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting client' });
  }
};
