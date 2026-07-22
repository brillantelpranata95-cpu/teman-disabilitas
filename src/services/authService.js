export const authService = {
  loginAdmin: async (username, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Store token in case we need it for headers (cookies also set automatically)
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return { username };
    } catch (error) {
      throw new Error('Username atau password salah.');
    }
  },
  
  logoutAdmin: async () => {
    localStorage.removeItem('auth_token');
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ action: 'verify' })
      });
      const data = await res.json();
      return data.authenticated;
    } catch (error) {
      return false;
    }
  }
};
