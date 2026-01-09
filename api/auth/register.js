// api/auth/register.js
import { connectDB } from '../../config/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Koneksi ke database
  await connectDB();

  const { username, email, password, alamat } = req.body;

  // Validasi input
  if (!username || !email || !password || !alamat) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tentukan role berdasarkan username
    const isSeller = User.isSellerByUsername(username);
    const role = isSeller ? 'seller' : 'buyer';

    // Buat user baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      alamat,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        alamat: newUser.alamat
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}