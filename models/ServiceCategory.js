const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#6fdd8b' },
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
