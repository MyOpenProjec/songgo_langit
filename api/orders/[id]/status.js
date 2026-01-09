// api/orders/[id]/status.js
import { connectDB } from '../../../config/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID wajib disertakan' });
  }

  if (!status) {
    return res.status(400).json({ error: 'Status wajib diisi' });
  }

  await connectDB();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    return res.status(200).json({ message: 'Status berhasil diperbarui' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}