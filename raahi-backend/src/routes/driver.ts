import express, { Request, Response } from 'express';
import { authenticate, authenticateDriver } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Placeholder driver routes
router.get('/profile', authenticateDriver, asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: 'Driver profile endpoint' });
}));

export default router;
