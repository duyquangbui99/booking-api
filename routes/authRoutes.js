const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', authController.login);
// GET /api/auth/verify (protected route to check login state)
router.get('/verify', auth(), authController.verifyUser);
// POST /api/auth/logout (clears JWT cookie)
router.post('/logout', authController.logout)

module.exports = router;
