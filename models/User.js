// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w{2,3}$/, 'Email tidak valid']
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  alamat: {
    type: String,
    required: [true, 'Alamat wajib diisi']
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Paksa nama collection jadi "users"
UserSchema.set('collection', 'users');

// Hindari duplikasi model
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;