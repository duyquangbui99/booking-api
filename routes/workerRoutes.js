const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const { auth } = require('../middleware/auth');


// Admin-only routes
router.post('/create', auth(['admin']), workerController.createWorker);
router.get('/', auth(['admin']), workerController.getAllWorkers);
router.get('/:id', auth(['admin']), workerController.getWorkerById);
router.put('/:id', auth(['admin']), workerController.updateWorker);
router.delete('/:id', auth(['admin']), workerController.deleteWorker);

module.exports = router;
