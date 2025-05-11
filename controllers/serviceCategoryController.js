const ServiceCategory = require('../models/ServiceCategory');

// Create a new service category
exports.createServiceCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existing = await ServiceCategory.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Category name already exists' });
        }

        const category = new ServiceCategory({ name });
        const saved = await category.save();

        res.status(201).json({ message: 'Category created', category: saved });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get specific category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
