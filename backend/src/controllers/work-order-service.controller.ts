import { Request, Response } from 'express';
import { WorkOrderService } from '../models/work-order-service.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllWorkOrderServices = async (req: Request, res: Response) => {
  try {
    const items = await WorkOrderService.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work order services' });
  }
};

export const createWorkOrderService = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderService.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating work order service' });
  }
};

export const getWorkOrderServiceById = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderService.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order service not found' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work order service' });
  }
};

export const updateWorkOrderService = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderService.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order service not found' });
    const { changes, changedKeys } = getChangedFields(item, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', item });
    }
    await item.update(changes);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating work order service' });
  }
};

export const deleteWorkOrderService = async (req: Request, res: Response) => {
  try {
    const item = await WorkOrderService.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Work order service not found' });
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting work order service' });
  }
};
