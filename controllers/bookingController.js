const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const { sendBookingConfirmation } = require('../utils/emailService');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { customerName, customerPhone, customerEmail, workerId, services, startTime } = req.body;

        if (!customerName || !customerPhone || !customerEmail || !workerId || !services || !startTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(customerEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!Array.isArray(services) || services.length === 0) {
            return res.status(400).json({ message: 'Services must be a non-empty array' });
        }

        const serviceIds = services.map(item => item.serviceId);
        const serviceDocs = await Service.find({ _id: { $in: serviceIds } });

        if (serviceDocs.length !== serviceIds.length) {
            return res.status(400).json({ message: 'One or more services not found' });
        }

        let totalDuration = 0;
        for (const item of services) {
            const svc = serviceDocs.find(s => s._id.toString() === item.serviceId);
            const quantity = item.quantity || 1;
            totalDuration += (svc?.duration || 0) * quantity;
        }

        const newBooking = new Booking({
            customerName,
            customerPhone,
            customerEmail,
            workerId,
            services,
            startTime: new Date(startTime),
            duration: totalDuration,
            status: 'booked'
        });

        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(400).json({ message: 'Worker not found' });
        }

        const savedBooking = await newBooking.save();

        await sendBookingConfirmation({
            customerEmail,
            customerName,
            ownerEmail: process.env.EMAIL_USER,
            workerName: worker.name,
            services: serviceDocs,
            startTime
        });

        res.status(201).json({ message: 'Booking created', booking: savedBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET ALL bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('workerId', 'name')
            .populate('services.serviceId', 'name duration');

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET bookings in a date range
exports.getBookingsByDateRange = async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end dates are required' });
        }

        const startDate = new Date(start);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(end);
        endDate.setUTCHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            startTime: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('workerId', 'name')
            .populate('services.serviceId', 'name duration');

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET specific worker's bookings
exports.getWorkerBookings = async (req, res) => {
    try {
        const { workerId } = req.params;

        const bookings = await Booking.find({ workerId })
            .populate('workerId', 'name')
            .populate('services.serviceId', 'name duration');

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET worker bookings in range
exports.getWorkerBookingsInRange = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { start, end } = req.query;

        const bookings = await Booking.find({
            workerId,
            startTime: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        })
            .populate('workerId', 'name')
            .populate('services.serviceId', 'name duration');

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { customerName, customerPhone, customerEmail, workerId, services, startTime, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (customerEmail) {
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(customerEmail)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            booking.customerEmail = customerEmail;
        }

        let duration = booking.duration;
        if (services) {
            const serviceIds = services.map(item => item.serviceId);
            const serviceDocs = await Service.find({ _id: { $in: serviceIds } });

            if (serviceDocs.length !== serviceIds.length) {
                return res.status(400).json({ message: 'One or more services not found' });
            }

            duration = 0;
            for (const item of services) {
                const svc = serviceDocs.find(s => s._id.toString() === item.serviceId);
                const quantity = item.quantity || 1;
                duration += (svc?.duration || 0) * quantity;
            }
            booking.services = services;
        }

        if (workerId && workerId.toString() !== booking.workerId.toString()) {
            const workerExists = await Worker.findById(workerId);
            if (!workerExists) {
                return res.status(400).json({ message: 'Worker not found' });
            }
            booking.workerId = workerId;
        }

        if (customerName) booking.customerName = customerName;
        if (customerPhone) booking.customerPhone = customerPhone;
        if (startTime) booking.startTime = new Date(startTime);
        if (status) booking.status = status;

        booking.duration = duration;

        const updatedBooking = await booking.save();

        res.json({ message: 'Booking updated', booking: updatedBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE booking
exports.deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const deleted = await Booking.findByIdAndDelete(bookingId);
        if (!deleted) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted successfully', booking: deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
