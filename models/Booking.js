const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    services: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        quantity: { type: Number, default: 1 }
    }],
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
