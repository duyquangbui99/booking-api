const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// POST /api/bookings/
router.post('/', bookingController.createBooking);

// GET /api/bookings/, get all bookings
router.get('/', auth(['admin']), bookingController.getAllBookings);

// GET /api/bookings/worker/:workerId, get specific worker's booking
router.get('/worker/:workerId', bookingController.getWorkerBookings);

// PUT /api/bookings/, update specific booking
router.put('/:bookingId', auth(['admin']), bookingController.updateBooking);

//DELETE  /api/bookings/, Delete specific booking
router.delete('/:bookingId', auth(['admin']), bookingController.deleteBooking);


module.exports = router;
