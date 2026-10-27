import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  School,
  Calendar,
  Heart,
  ShoppingBag,
  ArrowLeftRight,
  CheckCircle2,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { formatDate } from '../utils/formatDate';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileStats, setProfileStats] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, wishlistRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getWishlist(),
      ]);

      if (profileRes && profileRes.data) {
        setProfileStats(profileRes.data.stats);
        if (profileRes.data.user) {
          setFormData({
            name: profileRes.data.user.name || '',
            college: profileRes.data.user.college || '',
            avatar: profileRes.data.user.avatar || '',
          });
        }
      }

      if (wishlistRes && wishlistRes.data) {
        setWishlistItems(wishlistRes.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.college.trim()) {
      toast.error('Name and college cannot be blank.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading student profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-10">
      {/* Profile Overview Card */}
      <div className="bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-forest-800 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-forest-800 text-white flex items-center justify-center text-3xl font-editorial font-bold shadow-sm">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Verified Campus Member
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
                {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-600 flex items-center gap-2 mt-1">
                <School className="w-4 h-4 text-forest-700" />
                <span>{user?.college}</span>
                <span>•</span>
                <Mail className="w-4 h-4 text-forest-700" />
                <span>{user?.email}</span>
              </p>
              <p className="text-xs text-muted-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined ReWear on {formatDate(user?.createdAt)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="btn-outline text-xs px-4 py-2 self-start sm:self-center font-medium"
          >
            {editing ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </>
            ) : (
              <>
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Edit Inline Form */}
        {editing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 p-6 bg-ivory-100 rounded-2xl border border-border animate-fade-in space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-dark-900 mb-2">
              Update Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-900 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-900 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-outline text-xs px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs px-4 py-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}

        {/* User Activity Metrics */}
        {profileStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-ivory-100 p-4 rounded-2xl border border-border text-center">
              <p className="text-2xl font-bold text-forest-900 font-editorial">
                {profileStats.totalListings}
              </p>
              <p className="text-xs text-muted-600 mt-0.5">Total Listings</p>
            </div>
            <div className="bg-ivory-100 p-4 rounded-2xl border border-border text-center">
              <p className="text-2xl font-bold text-forest-900 font-editorial">
                {profileStats.activeListings}
              </p>
              <p className="text-xs text-muted-600 mt-0.5">Active Items</p>
            </div>
            <div className="bg-ivory-100 p-4 rounded-2xl border border-border text-center">
              <p className="text-2xl font-bold text-forest-900 font-editorial">
                {profileStats.acceptedRequests}
              </p>
              <p className="text-xs text-muted-600 mt-0.5">Accepted Trades</p>
            </div>
            <div className="bg-ivory-100 p-4 rounded-2xl border border-border text-center">
              <p className="text-2xl font-bold text-forest-900 font-editorial">
                {wishlistItems.length}
              </p>
              <p className="text-xs text-muted-600 mt-0.5">Saved to Wishlist</p>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-bold text-dark-900 font-editorial">
              My Saved Wishlist Items ({wishlistItems.length})
            </h2>
          </div>
        </div>

        <ProductGrid
          listings={wishlistItems}
          loading={false}
          emptyTitle="Your wishlist is empty"
          emptyDescription="Browse the campus marketplace and click the heart icon on items you love!"
          onClearFilters={null}
        />
      </div>
    </div>
  );
};

export default Profile;
