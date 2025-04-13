const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');

router.post('/', socialMediaController.createFacebookPost);

module.exports = router;
