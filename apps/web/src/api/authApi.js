const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('vape-shop-token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, config);
  } catch (fetchError) {
    throw new Error('Server se connect nahi ho pa raha. Backend server chalu hai?');
  }

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server se galat response aaya (${res.status}). Backend console mein errors check karo.`
    );
  }

  if (!res.ok) {
    throw new Error(data.message || `Server error: ${res.status}`);
  }

  return data;
}

export async function registerUser({ name, email, password, phone }) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
  localStorage.setItem('vape-shop-token', data.token);
  localStorage.setItem('vape-shop-user', JSON.stringify(data));
  return data;
}

export async function loginUser({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('vape-shop-token', data.token);
  localStorage.setItem('vape-shop-user', JSON.stringify(data));
  return data;
}

export async function getMe() {
  return request('/api/auth/me');
}

export async function updateProfile({ name, phone, address }) {
  const data = await request('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name, phone, address }),
  });
  const stored = JSON.parse(localStorage.getItem('vape-shop-user') || '{}');
  localStorage.setItem('vape-shop-user', JSON.stringify({ ...stored, ...data }));
  return data;
}

export function logoutUser() {
  localStorage.removeItem('vape-shop-token');
  localStorage.removeItem('vape-shop-user');
}

export function getStoredUser() {
  try {
    const user = localStorage.getItem('vape-shop-user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('vape-shop-token');
}
