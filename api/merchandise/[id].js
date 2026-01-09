// api/merchandise/[id].js
import { connectDB } from '../../config/db';
import Merchandise from '../../models/Merchandise';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID wajib disertakan' });
  }

  // GET /api/merchandise/:id
  if (req.method === 'GET') {
    try {
      const merchandise = await Merchandise.findById(id)
        .populate('seller_id', 'username');

      if (!merchandise) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      const response = {
        _id: merchandise._id.toString(),
        nama_barang: merchandise.nama_barang,
        harga: merchandise.harga,
        deskripsi: merchandise.deskripsi,
        gambar_url: merchandise.gambar_url,
        stock: merchandise.stock,
        seller_name: merchandise.seller_id?.username || 'Unknown Seller',
        created_at: merchandise.created_at,
        updated_at: merchandise.updated_at
      };

      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // PUT /api/merchandise/:id
  if (req.method === 'PUT') {
    const { nama_barang, harga, deskripsi, gambar_url, stock } = req.body;

    try {
      const updatedMerchandise = await Merchandise.findByIdAndUpdate(
        id,
        {
          nama_barang,
          harga: harga ? Number(harga) : undefined,
          deskripsi,
          gambar_url,
          stock: stock ? Number(stock) : undefined,
          updated_at: new Date()
        },
        { new: true }
      );

      if (!updatedMerchandise) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Produk berhasil diperbarui' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // DELETE /api/merchandise/:id
  if (req.method === 'DELETE') {
    try {
      const deleted = await Merchandise.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}