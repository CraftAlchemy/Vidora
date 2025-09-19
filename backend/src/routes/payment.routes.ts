import { Router } from 'express';
import { createPaymentIntent } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// @route   POST api/v1/payments/create-payment-intent
// @desc    Create a payment intent
// @access  Private
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

export default router;