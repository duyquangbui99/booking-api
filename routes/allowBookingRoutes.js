const express = require('express');
const router = express.Router();
const allowBookingcontroller = require('../controllers/allowBookingController');
const { auth } = require('../middleware/auth');

// router.post('/allowbooking', allowBookingcontroller.createSetting);
router.put('/allowbooking', auth(['admin']), allowBookingcontroller.updateAllowBooking);
router.get('/allowbooking', allowBookingcontroller.getSetting);

module.exports = router;
