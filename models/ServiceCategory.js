const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
