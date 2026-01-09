// api/orders/seller/[seller_id].js
import { connectDB } from '../../../config/db';
import Order from '../../../models/Order';
import OrderItem from '../../../models/OrderItem';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { seller_id } = req.query;

  if (!seller_id) {
    return res.status(400).json({ error: 'Seller ID wajib disertakan' });
  }

  await connectDB();

  try {
    const orders = await Order.find({ seller_id })
      .populate('buyer_id', 'username')
      .sort({ created_at: -1 });

    for (let order of orders) {
      const orderItems = await OrderItem.find({ order_id: order._id })
        .populate('merchandise_id', 'nama_barang gambar_url');

      order.items = orderItems.map(item => {
        const merch = item.merchandise_id || {};
        return {
          ...item.toObject(),
          nama_barang: merch.nama_barang || 'Barang Tidak Diketahui',
          gambar_url: merch.gambar_url || '',
        };
      });
    }

    const response = orders.map(order => {
      const obj = order.toObject();
      obj.items = order.items;
      return obj;
    });

    return res.status(200).json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}