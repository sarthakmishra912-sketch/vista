import express, { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { RideService } from '../services/rideService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @route   POST /api/rides
 * @desc    Create a new ride
 * @access  Private
 */
router.post('/', authenticate, [
  body('pickupLat').isFloat({ min: -90, max: 90 }).withMessage('Valid pickup latitude required'),
  body('pickupLng').isFloat({ min: -180, max: 180 }).withMessage('Valid pickup longitude required'),
  body('dropLat').isFloat({ min: -90, max: 90 }).withMessage('Valid drop latitude required'),
  body('dropLng').isFloat({ min: -180, max: 180 }).withMessage('Valid drop longitude required'),
  body('pickupAddress').isString().notEmpty().withMessage('Pickup address required'),
  body('dropAddress').isString().notEmpty().withMessage('Drop address required'),
  body('paymentMethod').isIn(['CASH', 'CARD', 'UPI', 'WALLET']).withMessage('Valid payment method required'),
  body('scheduledTime').optional().isISO8601().withMessage('Valid scheduled time required'),
  body('vehicleType').optional().isString().withMessage('Vehicle type must be string')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const {
    pickupLat,
    pickupLng,
    dropLat,
    dropLng,
    pickupAddress,
    dropAddress,
    paymentMethod,
    scheduledTime,
    vehicleType
  } = req.body;

  try {
    const ride = await RideService.createRide({
      passengerId: req.user!.id,
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
      pickupAddress,
      dropAddress,
      paymentMethod,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      vehicleType
    });

    res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      data: ride
    });
  } catch (error) {
    logger.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ride'
    });
  }
}));

/**
 * @route   GET /api/rides
 * @desc    Get user's rides
 * @access  Private
 */
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await RideService.getUserRides(req.user!.id, page, limit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rides'
    });
  }
}));

/**
 * @route   GET /api/rides/:id
 * @desc    Get ride by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const ride = await RideService.getRideById(id);

    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }

    // Check if user has access to this ride
    if (ride.passengerId !== req.user!.id && ride.driverId !== req.user!.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    logger.error('Get ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ride'
    });
  }
}));

/**
 * @route   POST /api/rides/:id/assign-driver
 * @desc    Assign driver to ride
 * @access  Private (Driver only)
 */
router.post('/:id/assign-driver', authenticate, [
  body('driverId').isString().notEmpty().withMessage('Driver ID required')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const { id } = req.params;
  const { driverId } = req.body;

  try {
    const ride = await RideService.assignDriver(id, driverId);

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: ride
    });
  } catch (error) {
    logger.error('Assign driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign driver'
    });
  }
}));

/**
 * @route   PUT /api/rides/:id/status
 * @desc    Update ride status
 * @access  Private
 */
router.put('/:id/status', authenticate, [
  body('status').isIn(['CONFIRMED', 'DRIVER_ARRIVED', 'RIDE_STARTED', 'RIDE_COMPLETED', 'CANCELLED']).withMessage('Valid status required'),
  body('cancellationReason').optional().isString().withMessage('Cancellation reason must be string')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const { id } = req.params;
  const { status, cancellationReason } = req.body;

  try {
    const ride = await RideService.updateRideStatus(
      id,
      status,
      req.user!.id,
      cancellationReason
    );

    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: ride
    });
  } catch (error) {
    logger.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status'
    });
  }
}));

/**
 * @route   POST /api/rides/:id/cancel
 * @desc    Cancel ride
 * @access  Private
 */
router.post('/:id/cancel', authenticate, [
  body('reason').optional().isString().withMessage('Cancellation reason must be string')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const { id } = req.params;
  const { reason } = req.body;

  try {
    const ride = await RideService.cancelRide(id, 'passenger', reason);

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: ride
    });
  } catch (error) {
    logger.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride'
    });
  }
}));

/**
 * @route   POST /api/rides/:id/track
 * @desc    Update driver location for tracking
 * @access  Private (Driver only)
 */
router.post('/:id/track', authenticate, [
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('heading').optional().isFloat({ min: 0, max: 360 }).withMessage('Valid heading required'),
  body('speed').optional().isFloat({ min: 0 }).withMessage('Valid speed required')
], asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const { id } = req.params;
  const { lat, lng, heading, speed } = req.body;

  try {
    // Get driver ID from user
    const { prisma } = await import('@/database/connection');
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user!.id }
    });

    if (!driver) {
      res.status(403).json({
        success: false,
        message: 'Driver access required'
      });
      return;
    }

    await RideService.updateDriverLocation(driver.id, lat, lng, heading, speed);

    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    logger.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
}));

export default router;
