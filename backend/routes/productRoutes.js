const express = require('express');
const router  = express.Router();
const {
  getProducts, getJerseys, getProductById, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { adminProtect } = require('../middleware/adminMiddleware');

// Public
router.get('/',            getProducts);
router.get('/jerseys',     getJerseys);
router.get('/:id',         getProductById);
router.get('/:id/related', getRelatedProducts);

// Admin-protected
router.post('/',    adminProtect, createProduct);
router.put('/:id',  adminProtect, updateProduct);
router.delete('/:id', adminProtect, deleteProduct);

module.exports = router;
