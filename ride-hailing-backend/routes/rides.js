const express = require('express');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Fare calculation algorithm
const roundToNearest5 = (amount) => Math.round(amount / 5) * 5;

// Calculate fare endpoint - called by frontend to show pricing like Uber/Ola
router.post('/calculate-fare', (req, res) => {
  try {
    const { distance_km, duration_min, traffic_level, weather, ride_type } = req.body;

    // Base Config with ride type variations
    let baseFare = 50;
    let perKmRate = 12;
    let perMinRate = 2;
    
    // Ride type adjustments
    if (ride_type === 'premium') {
      baseFare = 80;
      perKmRate = 18;
      perMinRate = 3;
    } else if (ride_type === 'bike') {
      baseFare = 30;
      perKmRate = 8;
      perMinRate = 1;
    } else if (ride_type === 'auto') {
      baseFare = 40;
      perKmRate = 10;
      perMinRate = 1.5;
    }

    let trafficCharge = 0;

    // Traffic-aware slab logic
    if (traffic_level === 1) {
      // Low traffic → normal rates
      // Keep default rates
    } else if (traffic_level === 2) {
      // Medium traffic → reduce per km slightly, add delay cost
      perKmRate = Math.round(perKmRate * 0.9);
      perMinRate = Math.round(perMinRate * 1.5);
      trafficCharge = 5; // flat fee
    } else if (traffic_level === 3) {
      // High traffic → km cheaper but time expensive
      perKmRate = Math.round(perKmRate * 0.8);
      perMinRate = Math.round(perMinRate * 2);
      trafficCharge = 10; // flat fee
    }

    // Weather adjustment
    let weatherCharge = 0;
    if (weather === "rain") weatherCharge = 15;
    else if (weather === "heat" || weather === "cold") weatherCharge = 10;

    //  Fare calculation
    let rawFare =
      baseFare +
      distance_km * perKmRate +
      duration_min * perMinRate +
      trafficCharge +
      weatherCharge;

    // 🔹 Fairness rounding
    const finalFare = roundToNearest5(rawFare);

    // Calculate estimated duration in minutes if not provided
    const estimatedDuration = duration_min || Math.round(distance_km * 2.5); // Rough estimate: 2.5 min per km

    res.json({
      status: "success",
      fare: finalFare,
      estimated_duration: estimatedDuration,
      breakdown: {
        baseFare,
        distanceCharge: distance_km * perKmRate,
        timeCharge: estimatedDuration * perMinRate,
        trafficCharge,
        weatherCharge,
        rawFare,
        finalFare,
        ride_type,
        perKmRate,
        perMinRate
      },
    });
  } catch (error) {
    console.error('Calculate fare error:', error);
    res.status(500).json({
      status: "error",
      error: 'Failed to calculate fare'
    });
  }
});

// Create ride
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { pickup_location, destination_location, ride_type, payment_method, fare, distance, estimated_duration } = req.body;
    
    // Validate required fields
    if (!pickup_location || !destination_location || !ride_type || !fare || !distance) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pickup_location, destination_location, ride_type, fare, and distance are required'
      });
    }

    // Validate fare is a positive number
    if (typeof fare !== 'number' || fare <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid fare amount'
      });
    }

    const db = req.app.locals.db;

    const result = await db.query(
      `INSERT INTO rides (rider_id, pickup_location, destination_location, ride_type, payment_method, fare, distance, estimated_duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.userId, JSON.stringify(pickup_location), JSON.stringify(destination_location), ride_type, payment_method, fare, distance, estimated_duration]
    );

    res.json({
      success: true,
      ride: result.rows[0],
      message: 'Ride created successfully'
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create ride'
    });
  }
});

// Get ride by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const result = await db.query('SELECT * FROM rides WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found'
      });
    }

    res.json({
      success: true,
      ride: result.rows[0]
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get ride'
    });
  }
});

// Update ride status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.locals.db;

    const result = await db.query(
      'UPDATE rides SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found'
      });
    }

    res.json({
      success: true,
      ride: result.rows[0]
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update ride status'
    });
  }
});

// Get user rides
router.get('/users/:userId/rides', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const db = req.app.locals.db;

    const result = await db.query(
      'SELECT * FROM rides WHERE rider_id = $1 OR driver_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      rides: result.rows
    });
  } catch (error) {
    console.error('Get user rides error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get rides'
    });
  }
});

module.exports = router;