const AllowBooking = require('../models/AllowBooking');

// POST: Create initial setting with allowBooking = true
exports.createSetting = async (req, res) => {
    try {
        const existing = await AllowBooking.findOne();
        if (existing) {
            return res.status(400).json({ message: 'Setting already exists' });
        }

        const setting = new AllowBooking(); // Defaults to true
        const saved = await setting.save();

        res.status(201).json({ message: 'Setting created', setting: saved });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT: Update allowBooking
exports.updateAllowBooking = async (req, res) => {
    try {
        const { allowBooking } = req.body;

        if (typeof allowBooking !== 'boolean') {
            return res.status(400).json({ message: 'allowBooking must be a boolean' });
        }

        let setting = await AllowBooking.findOne();
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        setting.allowBooking = allowBooking;
        setting.updatedAt = new Date();
        const updated = await setting.save();

        res.json({ message: 'allowBooking updated', setting: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET: Retrieve current setting
exports.getSetting = async (req, res) => {
    try {
        const setting = await AllowBooking.findOne();
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
