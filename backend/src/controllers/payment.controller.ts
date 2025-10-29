import { Request, Response } from 'express';
import { Payment } from '../models/payment.model';
import { getChangedFields } from '../utils/diff.util';

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating payment' });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payment' });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    const { changes, changedKeys } = getChangedFields(payment, req.body);
    if (changedKeys.length === 0) {
      return res.status(200).json({ message: 'No changes detected', payment });
    }
    await payment.update(changes);
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating payment' });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    await payment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting payment' });
  }
};
