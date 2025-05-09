const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// POST /api/bookings/
router.post('/', bookingController.createBooking);

// GET /api/bookings/, get all bookings
router.get('/', auth(['admin']), bookingController.getAllBookings);

// Get /api/booking/ranges
router.get('/range', bookingController.getBookingsByDateRange);

// GET /api/bookings/worker/:workerId, get specific worker's booking
router.get('/worker/:workerId', bookingController.getWorkerBookings);

// GET /api/bookings/worker/:workerId?start=...&end=... by range
router.get('/worker/:workerId/range', bookingController.getWorkerBookingsInRange);

// PUT /api/bookings/, update specific booking
router.put('/:bookingId', auth(['admin']), bookingController.updateBooking);

//DELETE  /api/bookings/, Delete specific booking
router.delete('/:bookingId', auth(['admin']), bookingController.deleteBooking);


module.exports = router;
