const express = require('express');
const router = express.Router();
const { generateCaptionFromUpload } = require('../controllers/gptController');

router.post('/caption', generateCaptionFromUpload);

module.exports = router;
