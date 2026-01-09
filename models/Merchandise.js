// models/Merchandise.js
import mongoose from 'mongoose';

const MerchandiseSchema = new mongoose.Schema({
  seller_id: {
    type: String,
    required: [true, 'Seller ID wajib diisi'],
    ref: 'User'
  },
  nama_barang: {
    type: String,
    required: [true, 'Nama barang wajib diisi'],
    trim: true
  },
  harga: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi wajib diisi']
  },
  gambar_url: {
    type: String,
    required: [true, 'Gambar URL wajib diisi']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock tidak boleh negatif']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Paksa nama collection jadi "merchandise"
MerchandiseSchema.set('collection', 'merchandise');

// Hindari duplikasi model
const Merchandise = mongoose.models.Merchandise || mongoose.model('Merchandise', MerchandiseSchema);
export default Merchandise;