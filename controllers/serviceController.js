const Service = require('../models/Service');

// Create a new service
exports.createService = async (req, res) => {
    try {
        const { name, price, duration, description, categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        const existing = await Service.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Service name already exists' });
        }

        const newService = new Service({ name, price, duration, description, categoryId });
        const savedService = await newService.save();

        res.status(201).json({ message: 'Service created', service: savedService });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Service updated', service: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
