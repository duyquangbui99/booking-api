const jwt = require('jsonwebtoken');

exports.auth = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        // Check for Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token with secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { userId, role }

            // If role check is needed
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            next(); // ✅ User is authenticated and authorized
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
