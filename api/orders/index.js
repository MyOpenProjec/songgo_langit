// api/orders/index.js
import { connectDB } from '../../config/db';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import Merchandise from '../../models/Merchandise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { buyer_id, seller_id, merchandise_id, quantity, total_amount } = req.body;

  if (!buyer_id || !seller_id || !merchandise_id || !quantity || !total_amount) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    // Cek stok
    const merchandise = await Merchandise.findById(merchandise_id);
    if (!merchandise) {
      return res.status(400).json({ error: 'Produk tidak ditemukan' });
    }

    if (merchandise.stock < quantity) {
      return res.status(400).json({ error: 'Stok tidak mencukupi' });
    }

    // Buat order
    const newOrder = new Order({
      buyer_id,
      seller_id,
      total_amount: Number(total_amount),
      status: 'menunggu'
    });

    await newOrder.save();

    // Buat order item
    const newOrderItem = new OrderItem({
      order_id: newOrder._id.toString(),
      merchandise_id,
      quantity: Number(quantity),
      harga_satuan: Number(total_amount) / Number(quantity)
    });

    await newOrderItem.save();

    // Kurangi stok
    merchandise.stock -= Number(quantity);
    await merchandise.save();

    return res.status(201).json({
      message: 'Order berhasil dibuat',
      orderId: newOrder._id.toString(),
      order: {
        id: newOrder._id.toString(),
        buyer_id: newOrder.buyer_id,
        seller_id: newOrder.seller_id,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        created_at: newOrder.created_at,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}