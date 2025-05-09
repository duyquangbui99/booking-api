const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');
const multer = require('../middleware/multerMiddleware');

router.post('/', multer.single('image'), socialMediaController.createFacebookPost);

module.exports = router;
