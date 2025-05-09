const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { auth } = require('../middleware/auth');

// Admin-only routes
router.post('/create', auth(['admin']), serviceController.createService);
router.get('/', serviceController.getAllServices);
router.put('/:id', auth(['admin']), serviceController.updateService);
router.delete('/:id', auth(['admin']), serviceController.deleteService);

module.exports = router;
