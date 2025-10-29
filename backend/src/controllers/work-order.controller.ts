import { Request, Response } from 'express';
import { WorkOrder } from '../models/work-order.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllWorkOrders = async (req: Request, res: Response) => {
  try {
    const workOrders = await WorkOrder.findAll();
    res.json(workOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work orders' });
  }
};

export const createWorkOrder = async (req: Request, res: Response) => {
  try {
    const workOrder = await WorkOrder.create(req.body);
    res.status(201).json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating work order' });
  }
};

export const getWorkOrderById = async (req: Request, res: Response) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder) return res.status(404).json({ error: 'Work order not found' });
    res.json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching work order' });
  }
};

export const updateWorkOrder = async (req: Request, res: Response) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder) return res.status(404).json({ error: 'Work order not found' });
    const { changes, changedKeys } = getChangedFields(workOrder, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', workOrder });
    }
    await workOrder.update(changes);
    res.json(workOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating work order' });
  }
};

export const deleteWorkOrder = async (req: Request, res: Response) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder) return res.status(404).json({ error: 'Work order not found' });
    await workOrder.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting work order' });
  }
};
