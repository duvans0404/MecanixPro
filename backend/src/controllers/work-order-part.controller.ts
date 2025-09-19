import { Request, Response } from 'express';
import { WorkOrderPart } from '../models/work-order-part.model';

export const getAllWorkOrderParts = async (req: Request, res: Response) => {
  try {
    const items = await WorkOrderPart.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work order parts' });
  }
};

export const createWorkOrderPart = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderPart.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating work order part' });
  }
};

export const getWorkOrderPartById = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderPart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order part not found' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work order part' });
  }
};

export const updateWorkOrderPart = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderPart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order part not found' });
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating work order part' });
  }
};

export const deleteWorkOrderPart = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderPart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order part not found' });
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting work order part' });
  }
};
