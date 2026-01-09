// api/users/[id].js
import { connectDB } from '../../config/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'User ID wajib disertakan' });
  }

  // GET /api/users/:id
  if (req.method === 'GET') {
    try {
      // Ambil hanya field yang dibutuhkan (tanpa password karena select: false)
      const user = await User.findById(id, 'username email alamat');

      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // PUT /api/users/:id
  if (req.method === 'PUT') {
    const { username, email, password, alamat } = req.body;

    // Validasi input
    if (!username || !email || !alamat) {
      return res.status(400).json({ error: 'Username, email, dan alamat wajib diisi' });
    }

    try {
      // Cek apakah username/email sudah digunakan oleh user lain
      const existingUser = await User.findOne({
        $or: [
          { username: username },
          { email: email }
        ],
        _id: { $ne: id }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username atau email sudah terdaftar' });
      }

      // Siapkan data update
      const updateData = {
        username,
        email,
        alamat
      };

      // Hash password jika ada
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Profil berhasil diperbarui' });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}