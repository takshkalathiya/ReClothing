import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from HTTP-only cookie on application mount
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await authApi.getMe();
      if (res && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      // 401 or no active session is expected for guests
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res && res.data) {
      setUser(res.data);
      if (res.data.token) {
        localStorage.setItem('reclothing_token', res.data.token);
      }
      toast.success(`Welcome back, ${res.data.name}!`);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res && res.data) {
      setUser(res.data);
      if (res.data.token) {
        localStorage.setItem('reclothing_token', res.data.token);
      }
      toast.success('Registration successful! Welcome to ReClothing.');
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem('reclothing_token');
      toast.success('Signed out successfully.');
    } catch (err) {
      setUser(null);
      localStorage.removeItem('reclothing_token');
    }
  };

  const updateProfile = async (data) => {
    const res = await userApi.updateProfile(data);
    if (res && res.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
      toast.success('Profile updated successfully.');
    }
    return res;
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      toast.error('Please log in to save items to your wishlist.');
      return false;
    }

    const currentWishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    const isCurrentlyIn = currentWishlist.some(
      (item) => (typeof item === 'object' ? item._id : item) === listingId
    );

    try {
      if (isCurrentlyIn) {
        await userApi.removeFromWishlist(listingId);
        setUser((prev) => ({
          ...prev,
          wishlist: prev.wishlist.filter(
            (item) => (typeof item === 'object' ? item._id : item) !== listingId
          ),
        }));
        toast.success('Removed from wishlist');
      } else {
        await userApi.addToWishlist(listingId);
        setUser((prev) => ({
          ...prev,
          wishlist: [...prev.wishlist, listingId],
        }));
        toast.success('Saved to your wishlist!');
      }
      return true;
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist.');
      return false;
    }
  };

  const isInWishlist = (listingId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some(
      (item) => (typeof item === 'object' ? item._id : item) === listingId
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        updateProfile,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
