const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/CategoryController');

router.get('/category/search', authMiddleware, getCategories);
router.get('/category/:id', authMiddleware, getCategoryById);
router.post('/category', authMiddleware, createCategory);
router.put('/category/:id', authMiddleware, updateCategory);
router.delete('/category/:id', authMiddleware, deleteCategory);

module.exports = router;
