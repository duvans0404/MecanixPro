import { Request, Response } from 'express';
import { Mechanic } from '../models/mechanic.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllMechanics = async (req: Request, res: Response) => {
  try {
    const mechanics = await Mechanic.findAll();
    res.json(mechanics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching mechanics' });
  }
};

export const createMechanic = async (req: Request, res: Response) => {
  try {
    const mechanic = await Mechanic.create(req.body);
    res.status(201).json(mechanic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating mechanic' });
  }
};

export const getMechanicById = async (req: Request, res: Response) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    res.json(mechanic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching mechanic' });
  }
};

export const updateMechanic = async (req: Request, res: Response) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    const { changes, changedKeys } = getChangedFields(mechanic, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', mechanic });
    }
    await mechanic.update(changes);
    res.json(mechanic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating mechanic' });
  }
};

export const deleteMechanic = async (req: Request, res: Response) => {
  try {
    const mechanic = await Mechanic.findByPk(req.params.id);
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    await mechanic.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting mechanic' });
  }
};
