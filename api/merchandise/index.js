// api/merchandise/index.js
import { connectDB } from '../../config/db';
import Merchandise from '../../models/Merchandise';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectDB();

  // GET /api/merchandise?seller_id=...
  if (req.method === 'GET') {
    const { seller_id } = req.query;

    if (!seller_id) {
      return res.status(400).json({ error: 'Seller ID wajib disertakan' });
    }

    try {
      const merchandise = await Merchandise.find({ seller_id })
        .sort({ created_at: -1 });

      return res.status(200).json(merchandise);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // POST /api/merchandise
  if (req.method === 'POST') {
    const { seller_id, nama_barang, harga, deskripsi, gambar_url, stock } = req.body;

    if (!seller_id || !nama_barang || !harga || !deskripsi || !gambar_url) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    try {
      const newMerchandise = new Merchandise({
        seller_id,
        nama_barang,
        harga: Number(harga),
        deskripsi,
        gambar_url,
        stock: stock ? Number(stock) : 0
      });

      await newMerchandise.save();

      return res.status(201).json({
        id: newMerchandise._id.toString(),
        seller_id: newMerchandise.seller_id,
        nama_barang: newMerchandise.nama_barang,
        harga: newMerchandise.harga,
        deskripsi: newMerchandise.deskripsi,
        gambar_url: newMerchandise.gambar_url,
        stock: newMerchandise.stock,
        created_at: newMerchandise.created_at,
        updated_at: newMerchandise.updated_at
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Method tidak diizinkan
  return res.status(405).json({ error: 'Method not allowed' });
}