const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supplyagent_super_secret_jwt_key_2026';

// POST /api/auth/login - Simulate GitHub OAuth or local credential login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Allows mock login for supply chain manager
  const user = {
    id: 'user_admin_01',
    username: username || 'parth_admin',
    name: 'Parth Patel',
    role: 'Supply Chain Manager / Tenant Admin',
    tenant_id: 'tenant_01',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    message: 'Login successful.',
    token,
    user
  });
});

// GET /api/auth/me - Verify current user session
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false, message: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false, message: 'Unauthorized: Session expired.' });
  }
});

module.exports = router;
