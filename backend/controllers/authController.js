const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ SIGNUP FUNCTION
const signup = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const [existingUser] = await pool.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.promise().query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone]
    );

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ LOGIN FUNCTION
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'your_secret_key', // Ideally use process.env.JWT_SECRET
      { expiresIn: '1h' }
    );

    res.json({ msg: 'Login successful', token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ EXPORT BOTH
module.exports = {
  signup,
  login
};
