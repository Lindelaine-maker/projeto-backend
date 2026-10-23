const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/ProductController');

router.get('/product/search', authMiddleware, getProducts);
router.get('/product/:id', authMiddleware, getProductById);
router.post('/product', authMiddleware, createProduct);
router.put('/product/:id', authMiddleware, updateProduct);
router.delete('/product/:id', authMiddleware, deleteProduct);

module.exports = router;
