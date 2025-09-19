import { Request, Response } from 'express';
import { Part } from '../models/part.model';

export const getAllParts = async (req: Request, res: Response) => {
  try {
    const parts = await Part.findAll();
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching parts' });
  }
};

export const createPart = async (req: Request, res: Response) => {
  try {
    const part = await Part.create(req.body);
    res.status(201).json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating part' });
  }
};

export const getPartById = async (req: Request, res: Response) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ error: 'Part not found' });
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching part' });
  }
};

export const updatePart = async (req: Request, res: Response) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ error: 'Part not found' });
    await part.update(req.body);
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating part' });
  }
};

export const deletePart = async (req: Request, res: Response) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ error: 'Part not found' });
    await part.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting part' });
  }
};
