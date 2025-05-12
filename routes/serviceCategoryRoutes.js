const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/serviceCategoryController');
const { auth } = require('../middleware/auth');

router.post('/', auth(['admin']), categoryController.createServiceCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
//delete later
router.put('/:id', categoryController.updateCategory);

module.exports = router;