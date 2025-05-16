const mongoose = require('mongoose');

const allowBookingSchema = new mongoose.Schema({
    allowBooking: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AllowBooking', allowBookingSchema);