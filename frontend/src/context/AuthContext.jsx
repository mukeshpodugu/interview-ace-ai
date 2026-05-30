import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Sync theme with HTML document node
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load user profile on bootstrap
  useEffect(() => {
    const bootstrapUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.auth.getMe();
          setUser(userData);
        } catch (err) {
          console.warn('Bootstrap token invalid:', err.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrapUser();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleUser) => {
    setLoading(true);
    try {
      const data = await api.auth.googleLogin(
        googleUser.name,
        googleUser.email,
        googleUser.googleId,
        googleUser.profilePic
      );
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await api.auth.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const updateLocalScores = (newScores) => {
    if (newScores) {
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, scores: newScores };
      });
    }
  };

  const updateLocalBadges = (newBadges) => {
    if (newBadges) {
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, badges: newBadges };
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        updateLocalScores,
        updateLocalBadges,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
