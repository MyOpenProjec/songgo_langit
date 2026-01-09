// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  buyer_id: {
    type: String,
    required: [true, 'Buyer ID wajib diisi'],
    ref: 'User'
  },
  seller_id: {
    type: String,
    required: [true, 'Seller ID wajib diisi'],
    ref: 'User'
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount wajib diisi'],
    min: [0, 'Total amount tidak boleh negatif']
  },
  status: {
    type: String,
    enum: ['menunggu', 'dikirim', 'diterima', 'dibatalkan'],
    default: 'menunggu'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Paksa nama collection jadi "orders"
OrderSchema.set('collection', 'orders');

// Hindari duplikasi model
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;