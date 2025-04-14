const express = require('express');
const router = express.Router();
const { generateCaption } = require('../controllers/gptController');

router.post('/caption', generateCaption);

module.exports = router;
