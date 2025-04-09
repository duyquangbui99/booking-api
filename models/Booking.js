const mongoose = require('mongoose');
//Example of Booking
// {
//     "customerName": "Emma Nguyen",
//     "customerPhone": "555-123-4567",
//     "workerId": "654abcd...",
//     "serviceIds": ["123abc...", "456def..."],
//     "date": "2025-04-06",
//     "time": "14:00"
// }

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    serviceIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    date: {
        type: String, // e.g. "2025-04-06"
        required: true
    },
    time: {
        type: String, // e.g. "14:00"
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
