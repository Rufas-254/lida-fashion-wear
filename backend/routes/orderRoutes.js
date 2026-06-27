const express = require('express');
const router  = express.Router();
const {
  placeOrder, getMyOrders, getOrderById,
  getAllOrders, getOrderStats, updateOrderStatus, updatePaymentStatus,
} = require('../controllers/orderController');
const { protect }      = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

// User routes (protected)
router.post('/',           protect, placeOrder);
router.get('/my-orders',   protect, getMyOrders);
router.get('/:id',         protect, getOrderById);

// Admin routes
router.get('/',                       adminProtect, getAllOrders);
router.get('/admin/stats',            adminProtect, getOrderStats);
router.put('/:id/status',             adminProtect, updateOrderStatus);
router.put('/:id/payment',            adminProtect, updatePaymentStatus);

module.exports = router;
