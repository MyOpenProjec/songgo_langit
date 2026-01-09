// api/auth/index.js
import { connectDB } from '../../config/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { action } = req.query; // ?action=login atau ?action=register

  if (action === 'login') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        message: 'Login berhasil',
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          alamat: user.alamat
        }
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (action === 'register') {
    const { username, email, password, alamat } = req.body;

    if (!username || !email || !password || !alamat) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email sudah terdaftar' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const isSeller = User.isSellerByUsername(username);
      const role = isSeller ? 'seller' : 'buyer';

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        alamat,
        role
      });

      await newUser.save();

      return res.status(201).json({
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
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(400).json({ error: 'Parameter "action" wajib diisi: login atau register' });
}