const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { name, pin } = req.body;
    try {
        const user = await User.findOne({ name });
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

