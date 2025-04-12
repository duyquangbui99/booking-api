const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    startTime: {
        type: Date,
        required: true
    },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
    createdAt: { type: Date, default: Date.now },
    duration: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Booking', bookingSchema);
