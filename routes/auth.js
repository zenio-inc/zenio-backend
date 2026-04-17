import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashed
    });

    res.json({
      message: 'User created',
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: login }, { username: login }]
    });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;