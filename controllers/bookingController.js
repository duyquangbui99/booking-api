const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Service = require('../models/Service');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { customerName, customerPhone, workerId, serviceIds, startTime } = req.body;

        // Validate input
        if (!customerName || !customerPhone || !workerId || !serviceIds || !startTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch services to calculate total duration
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (services.length !== serviceIds.length) {
            return res.status(400).json({ message: 'One or more services not found' });
        }

        const totalDuration = services.reduce((acc, svc) => acc + svc.duration, 0); // in minutes

        // Create booking
        const newBooking = new Booking({
            customerName,
            customerPhone,
            workerId,
            serviceIds,
            startTime: new Date(startTime),
            duration: totalDuration
        });

        const savedBooking = await newBooking.save();

        // Optionally update worker's timeSlotsTaken here in the future

        res.status(201).json({ message: 'Booking created', booking: savedBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

//GET ALL bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('workerId', 'name') // only get worker name
            .populate('serviceIds', 'name duration'); // only get service name + duration

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

//get the specific worker's booking 
exports.getWorkerBookings = async (req, res) => {
    try {
        const { workerId } = req.params;

        const bookings = await Booking.find({ workerId })
            .populate('workerId', 'name')
            .populate('serviceIds', 'name duration');

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
        const { customerName, customerPhone, workerId, serviceIds, startTime, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Validate and update services + duration
        let duration = booking.duration;
        if (serviceIds) {
            const services = await Service.find({ _id: { $in: serviceIds } });
            if (services.length !== serviceIds.length) {
                return res.status(400).json({ message: 'One or more services not found' });
            }
            duration = services.reduce((acc, s) => acc + s.duration, 0);
            booking.serviceIds = serviceIds;
        }

        // Validate and update workerId
        if (workerId && workerId.toString() !== booking.workerId.toString()) {
            const workerExists = await Worker.findById(workerId);
            if (!workerExists) {
                return res.status(400).json({ message: 'Worker not found' });
            }
            booking.workerId = workerId;
        }

        // Apply updates
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

//DELETE booking
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