// api/merchandise/search.js
import { connectDB } from '../../config/db';
import Merchandise from '../../models/Merchandise';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query wajib diisi' });
  }

  await connectDB();

  try {
    const regex = new RegExp(q, 'i');

    const merchandise = await Merchandise.find({
      $or: [
        { nama_barang: { $regex: regex } },
        { seller_id: { $in: await User.find({ username: { $regex: regex } }).distinct('_id') } }
      ],
      stock: { $gt: 0 }
    })
      .populate('seller_id', 'username')
      .sort({ created_at: -1 });

    const formatted = merchandise.map(m => ({
      ...m.toObject(),
      seller_name: m.seller_id?.username || 'Unknown Seller'
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}