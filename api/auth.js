import crypto from 'crypto';

// Simple token-based auth. No external deps needed.
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, username, password, token } = req.body || {};

  if (action === 'login') {
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }
    const newToken = generateToken();
    // Store token in a cookie + return it
    res.setHeader('Set-Cookie', `auth_token=${newToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    return res.status(200).json({ token: newToken, message: 'Login berhasil' });
  }

  if (action === 'verify') {
    const cookieToken = parseCookie(req.headers.cookie || '', 'auth_token');
    const headerToken = token || req.headers['x-auth-token'];
    if (cookieToken || headerToken) {
      return res.status(200).json({ authenticated: true });
    }
    return res.status(200).json({ authenticated: false });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return res.status(200).json({ message: 'Logout berhasil' });
  }

  return res.status(400).json({ error: 'Invalid action' });
}

function parseCookie(cookieStr, name) {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}
