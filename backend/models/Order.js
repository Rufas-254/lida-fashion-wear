const mongoose = require('mongoose');

// ─── Order Item Sub-Schema ────────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: { type: String, required: true }, // snapshot at order time
  productImage: { type: String, default: '' },   // snapshot URL
  size:         { type: String, required: true },
  color:        { type: String, default: '' },
  quantity:     { type: Number, required: true, min: 1 },
  unitPrice:    { type: Number, required: true },
  subtotal:     { type: Number, required: true },
}, { _id: false });

// ─── Order Schema ─────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      // Auto-generated in controller: LFW-YYYY-XXXXX
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      country: { type: String, required: true, default: 'Kenya' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    trackingNote: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'M-Pesa', 'Card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
  },
  { timestamps: true }
);

// ─── Auto-generate Order Number ───────────────────────────────────────────────
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year  = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments() + 1;
    this.orderNumber = `LFW-${year}-${String(count).padStart(5, '0')}`;
  }
  next();
});

// Index for query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
