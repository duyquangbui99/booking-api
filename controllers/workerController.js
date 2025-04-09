const Worker = require('../models/Worker');
const User = require('../models/User');
require('../models/Service');


exports.createWorker = async (req, res) => {
    try {
        const { name, phone, services, workingDays, workingHours, pin } = req.body;

        // 1️⃣ Validate PIN (must be exactly 4 digits)
        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
        }

        // 2️⃣ Check if name already exists in users
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 3️⃣ Create Worker
        const newWorker = new Worker({
            name,
            phone,
            services,
            workingDays,
            workingHours
        });

        const savedWorker = await newWorker.save();

        // 4️⃣ Create User
        const newUser = new User({
            name,
            pin, // plain pin for worker
            role: 'worker',
            workerId: savedWorker._id
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'Worker and user created successfully',
            worker: savedWorker,
            user: savedUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all workers
exports.getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().populate('services');
        res.json(workers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single worker
exports.getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).populate('services');
        if (!worker) return res.status(404).json({ message: 'Worker not found' });
        res.json(worker);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update worker
exports.updateWorker = async (req, res) => {
    try {
        const { name, phone, services, workingDays, workingHours, pin } = req.body;

        // Step 1: Find existing worker
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Step 2: PIN validation (must be exactly 4 digits)
        if (pin && !/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
        }

        // Step 3: Check for name conflict in User (if name is being changed)
        if (name && name !== worker.name) {
            const nameExists = await User.findOne({ name });
            if (nameExists) {
                return res.status(400).json({ message: 'This username is already taken' });
            }
        }

        // Step 4: Update Worker
        worker.name = name || worker.name;
        worker.phone = phone || worker.phone;
        worker.services = services || worker.services;
        worker.workingDays = workingDays || worker.workingDays;
        worker.workingHours = workingHours || worker.workingHours;

        const updatedWorker = await worker.save();

        // Step 5: Update User
        const user = await User.findOne({ workerId: req.params.id });
        if (user) {
            if (name) user.name = name;
            if (pin) user.pin = pin; // keeping plain-text for workers
            await user.save();
        }

        res.json({
            message: 'Worker and user updated successfully',
            worker: updatedWorker,
            user: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete worker and user account
exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) return res.status(404).json({ message: 'Worker not found' });

        await User.findOneAndDelete({ workerId: req.params.id });

        res.json({ message: 'Worker and user deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
