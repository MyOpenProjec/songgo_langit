// models/OrderItem.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: [true, 'Order ID wajib diisi'],
    ref: 'Order'
  },
  merchandise_id: {
    type: String,
    required: [true, 'Merchandise ID wajib diisi'],
    ref: 'Merchandise'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity wajib diisi'],
    min: [1, 'Quantity minimal 1']
  },
  harga_satuan: {
    type: Number,
    required: [true, 'Harga satuan wajib diisi'],
    min: [0, 'Harga satuan tidak boleh negatif']
  }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

// Paksa nama collection jadi "order_items"
OrderItemSchema.set('collection', 'order_items');

// Hindari duplikasi model
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);
export default OrderItem;