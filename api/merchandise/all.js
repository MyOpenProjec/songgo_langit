// api/merchandise/all.js
import { connectDB } from '../../config/db';
import Merchandise from '../../models/Merchandise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  try {
    const merchandise = await Merchandise.find({ stock: { $gt: 0 } })
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