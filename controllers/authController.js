const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const nameInput = req.body.name.trim().toLowerCase();
    const pin = req.body.pin;
    try {
        const user = await User.findOne({ name: { $regex: new RegExp(`^${nameInput}$`, 'i') } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Role-based login logic
        if (user.role === 'admin') {
            const isMatch = await bcrypt.compare(pin, user.pin);
            if (!isMatch) return res.status(401).json({ message: 'Invalid admin PIN' });
        } else {
            if (user.pin !== pin) {
                return res.status(401).json({ message: 'Invalid worker PIN' });
            }
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({
            token,
            role: user.role,
            ...(user.role === 'worker' && { workerId: user.workerId })
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.json({ message: 'Logged out successfully' });
};

exports.verifyUser = async (req, res) => {
    try {
        const { userId, role } = req.user; // comes from middleware
        const user = await require('../models/User').findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: user.name,
            role: user.role,
            ...(user.role === 'worker' && { workerId: user.workerId }),
        });
    } catch (err) {
        console.error('Error in verifyUser:', err);
        res.status(500).json({ message: 'Server error' });
    }
};