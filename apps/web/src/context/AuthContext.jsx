import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateProfile as updateProfileApi,
  getStoredUser,
  getStoredToken,
} from '@/api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const freshUser = await getMe();
      setUser(freshUser);
    } catch {
      logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && stored.token) {
      setUser(stored);
      setLoading(false);
      getMe()
        .then((fresh) => setUser(fresh))
        .catch(() => {
          logoutUser();
          setUser(null);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const data = await registerUser({ name, email, password, phone });
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const data = await updateProfileApi(updates);
    setUser((prev) => ({ ...prev, ...data }));
    return data;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user?.token || !!user?._id,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
