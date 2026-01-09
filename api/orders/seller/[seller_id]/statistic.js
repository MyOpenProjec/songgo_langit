// api/orders/seller/[seller_id]/statistic.js
import { connectDB } from '../../../../config/db';
import Order from '../../../../models/Order';

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
    const stats = await Order.aggregate([
      {
        $match: { seller_id: seller_id }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          menunggu: { $sum: { $cond: [{ $eq: ["$status", "menunggu"] }, 1, 0] } },
          dikirim: { $sum: { $cond: [{ $eq: ["$status", "dikirim"] }, 1, 0] } },
          diterima: { $sum: { $cond: [{ $eq: ["$status", "diterima"] }, 1, 0] } },
          dibatalkan: { $sum: { $cond: [{ $eq: ["$status", "dibatalkan"] }, 1, 0] } }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        total: 0,
        menunggu: 0,
        dikirim: 0,
        diterima: 0,
        dibatalkan: 0,
        percentages: {
          menunggu: 0,
          dikirim: 0,
          diterima: 0,
          dibatalkan: 0,
        }
      });
    }

    const total = stats[0].total;
    const percentages = {
      menunggu: Math.round((stats[0].menunggu / total) * 100) || 0,
      dikirim: Math.round((stats[0].dikirim / total) * 100) || 0,
      diterima: Math.round((stats[0].diterima / total) * 100) || 0,
      dibatalkan: Math.round((stats[0].dibatalkan / total) * 100) || 0,
    };

    return res.status(200).json({
      total: total,
      menunggu: stats[0].menunggu,
      dikirim: stats[0].dikirim,
      diterima: stats[0].diterima,
      dibatalkan: stats[0].dibatalkan,
      percentages: percentages
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}