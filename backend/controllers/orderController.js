const Order   = require('../models/Order');
const Product = require('../models/Product');

const PAGE_SIZE = 10;

// ─── POST /api/orders — Place a new order (User) ──────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Build order items with product snapshots
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product "${item.productName || item.product}" is no longer available` });
      }

      const unitPrice = product.price;
      const subtotal  = unitPrice * item.quantity;
      totalAmount    += subtotal;

      orderItems.push({
        product:      product._id,
        productName:  product.name,
        productImage: product.images[0] || '',
        size:         item.size,
        color:        item.color || '',
        quantity:     item.quantity,
        unitPrice,
        subtotal,
      });
    }

    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        _id:         order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status:      order.status,
        createdAt:   order.createdAt,
      },
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/my-orders — User's orders ───────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const pageNum = Math.max(1, Number(page));
    const skip    = (pageNum - 1) * PAGE_SIZE;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      page:       pageNum,
      totalPages: Math.ceil(total / PAGE_SIZE),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/:id — Single order detail (User) ────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Users can only see their own orders
    if (req.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders — All orders (Admin) ────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = PAGE_SIZE } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));
    const skip     = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'fullName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      page:       pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/stats — Dashboard stats (Admin) ─────────────────────────
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      pendingOrders,
      totalRevenue,
      statusBreakdown,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: 'Pending' }),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      todayOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/orders/:id/status — Update order status (Admin) ─────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNote } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (trackingNote !== undefined) order.trackingNote = trackingNote;

    const updated = await order.save();
    res.json({ message: 'Order status updated', order: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/orders/:id/payment — Update payment status (Admin) ──────────────
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['Unpaid', 'Paid'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Payment status must be Unpaid or Paid' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder, getMyOrders, getOrderById,
  getAllOrders, getOrderStats, updateOrderStatus, updatePaymentStatus,
};
