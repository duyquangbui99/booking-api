const jwt = require('jsonwebtoken');

exports.auth = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.cookies?.token; // 🔥 Read token from cookie

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
