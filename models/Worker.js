const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    timeSlotsTaken: {
        type: Map,
        of: [String], // Example: { "2025-04-05": ["10:00", "14:00"] }
        default: {}
    },
    workingDays: {
        type: [String], // e.g., ["Monday", "Wednesday", "Friday"]
        required: true
    },
    workingHours: {
        start: { type: String, default: "09:30" },
        end: { type: String, default: "19:30" }
    }
});

module.exports = mongoose.model('Worker', workerSchema);
