import { Request, Response } from 'express';
import { Service } from '../models/service.model';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating service' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    await service.update(req.body);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    await service.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting service' });
  }
};
