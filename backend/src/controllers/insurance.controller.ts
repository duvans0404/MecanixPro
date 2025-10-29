import { Request, Response } from 'express';
import { Insurance } from '../models/insurance.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllInsurances = async (req: Request, res: Response) => {
  try {
    const insurances = await Insurance.findAll();
    res.json(insurances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching insurances' });
  }
};

export const createInsurance = async (req: Request, res: Response) => {
  try {
    const insurance = await Insurance.create(req.body);
    res.status(201).json(insurance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating insurance' });
  }
};

export const getInsuranceById = async (req: Request, res: Response) => {
  try {
    const insurance = await Insurance.findByPk(req.params.id);
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    res.json(insurance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching insurance' });
  }
};

export const updateInsurance = async (req: Request, res: Response) => {
  try {
    const insurance = await Insurance.findByPk(req.params.id);
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    const { changes, changedKeys } = getChangedFields(insurance, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', insurance });
    }
    await insurance.update(changes);
    res.json(insurance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating insurance' });
  }
};

export const deleteInsurance = async (req: Request, res: Response) => {
  try {
    const insurance = await Insurance.findByPk(req.params.id);
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    await insurance.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting insurance' });
  }
};
