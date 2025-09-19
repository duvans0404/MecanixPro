import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating vehicle' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching vehicle' });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating vehicle' });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    await vehicle.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting vehicle' });
  }
};
