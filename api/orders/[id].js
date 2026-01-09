// api/orders/[id].js
import { connectDB } from '../../config/db';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID wajib disertakan' });
  }

  await connectDB();

  try {
    // Ambil order item
    const orderItems = await OrderItem.find({ order_id: id })
      .populate('merchandise_id', 'nama_barang gambar_url harga deskripsi');

    if (orderItems.length === 0) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Ambil order
    const order = await Order.findById(id)
      .populate('buyer_id', 'username')
      .populate('seller_id', 'username');

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Format response
    const items = orderItems.map(item => ({
      ...item.toObject(),
      nama_barang: item.merchandise_id?.nama_barang,
      gambar_url: item.merchandise_id?.gambar_url,
      harga_satuan: item.merchandise_id?.harga,
      deskripsi: item.merchandise_id?.deskripsi
    }));

    const response = {
      ...order.toObject(),
      items: items
    };

    return res.status(200).json(response);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}