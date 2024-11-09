require('dotenv').config(); // Mengaktifkan dotenv
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Impor cors

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke MySQL dengan Sequelize menggunakan variabel dari .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306, // Gunakan port default jika tidak diset
    logging: false, // Nonaktifkan logging jika tidak perlu
  }
);

// Pengujian Koneksi
sequelize.authenticate()
  .then(() => console.log('Koneksi ke database MySQL berhasil!'))
  .catch(err => console.error('Gagal terhubung ke database MySQL:', err));

// Model User
const User = sequelize.define('tb_admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin'),
    defaultValue: 'admin',
  },
}, {
  tableName: 'tb_admin',
});

// Model Token
const Token = sequelize.define('tb_tokens', {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'tb_tokens',
});

// Relasi
User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Middleware Autentikasi
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null; 

    if (!token) {
      return res.status(401).json({ message: 'Akses Ditolak, token tidak disediakan' });
    }

    // Cek apakah token aktif di database
    const userToken = await Token.findOne({ where: { token, isActive: true } });
    if (!userToken) {
      return res.status(403).json({ message: 'Token tidak valid atau sudah tidak aktif' });
    }

    // Verifikasi token menggunakan jwt
    jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
      }

      req.user = decoded; // Menyimpan informasi pengguna di request
      next(); // Melanjutkan ke middleware berikutnya
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat memvalidasi token', error: error.message });
  }
};


// Route Registrasi Admin/Superadmin
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi' });
  }

  try {
    // Cek apakah username sudah terdaftar
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username sudah terdaftar' });
    }

    // Hash password dan set role menjadi 'admin'
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, password: hashedPassword, role: 'admin' });

    res.status(201).json({ message: 'Pengguna berhasil didaftarkan', user });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mendaftarkan pengguna', error });
  }
});


// Route Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
  }

  try {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ where: { username } });

    // Periksa apakah pengguna ditemukan
    if (!user) {
      return res.status(401).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Verifikasi password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }

    // Buat token dengan format Bearer
    const token = `Bearer ${jwt.sign({ id: user.id, username: user.username }, 'SECRET_KEY', { expiresIn: '1h' })}`;

    // Simpan token ke tabel tb_tokens
    await Token.create({ userId: user.id, token: token.split(' ')[1] }); // Hanya simpan bagian token, bukan "Bearer"

    // Login berhasil
    res.json({ success: true, message: 'Login berhasil', user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login' });
  }
});



// Route untuk Superadmin
app.get('/superadmin', authenticateJWT, (req, res) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Akses Ditolak' });
  }
  res.json({ message: 'Selamat datang, Superadmin' });
});

// Route untuk Admin
app.get('/admin', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Akses Ditolak' });
  }
  res.json({ message: 'Selamat datang, Admin' });
});

// Route Logout
app.post('/logout', authenticateJWT, async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token tidak disediakan' });
    }

    const tokenExists = await Token.findOne({ where: { token } });
    if (!tokenExists) {
      return res.status(404).json({ message: 'Token tidak ditemukan' });
    }

    // Update token menjadi tidak aktif (isActive: false)
    await Token.update({ isActive: false }, { where: { token } });

    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Error during logout:', error); // Tambahkan log untuk membantu debugging
    res.status(500).json({ message: 'Terjadi kesalahan saat logout', error: error.message });
  }
});



// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});