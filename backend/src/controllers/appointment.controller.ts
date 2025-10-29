import { Request, Response } from 'express';
import { Appointment } from '../models/appointment.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating appointment' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointment' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    const { changes, changedKeys } = getChangedFields(appointment, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', appointment });
    }
    await appointment.update(changes);
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
};
