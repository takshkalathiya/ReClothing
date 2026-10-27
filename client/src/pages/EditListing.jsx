import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit,
  ArrowLeft,
  DollarSign,
  Tag,
  ArrowLeftRight,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const CATEGORIES = ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Books', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const STATUSES = ['active', 'reserved', 'sold', 'exchanged', 'inactive'];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Clothing',
    price: '',
    size: '',
    condition: 'Good',
    listingType: 'For Sale',
    images: [''],
    exchangePreference: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listingApi.getListingById(id);
        if (res && res.data) {
          const l = res.data;
          // Check ownership
          if (user && l.seller?._id !== user._id) {
            setError('Access Denied: You can only edit your own listings.');
            return;
          }

          setFormData({
            title: l.title || '',
            description: l.description || '',
            category: l.category || 'Clothing',
            price: l.price !== undefined ? String(l.price) : '',
            size: l.size || '',
            condition: l.condition || 'Good',
            listingType: l.listingType || 'For Sale',
            images: l.images?.length > 0 ? l.images : [''],
            exchangePreference: l.exchangePreference || '',
            status: l.status || 'active',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load listing for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    if (formData.images.length < 4) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description cannot be empty.');
      return;
    }

    const validImages = formData.images.filter((img) => img.trim().length > 0);
    if (validImages.length === 0) {
      toast.error('At least one valid image URL is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.listingType === 'For Exchange' ? 0 : Number(formData.price || 0),
        size: formData.size.trim() || 'N/A',
        condition: formData.condition,
        listingType: formData.listingType,
        images: validImages,
        exchangePreference: formData.exchangePreference.trim(),
        status: formData.status,
      };

      await listingApi.updateListing(id, payload);
      toast.success('Listing updated successfully!');
      navigate(`/listings/${id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading listing information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ErrorMessage message={error} />
        <Link to="/my-listings" className="btn-outline mt-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-6">
        <Link
          to={`/listings/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Details</span>
        </Link>
      </div>

      <div className="bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-card">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold mb-2">
            <Edit className="w-3.5 h-3.5 text-forest-700" />
            <span>Update Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
            Edit: {formData.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-1">
            Keep your listing details accurate and up to date for campus buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Field */}
          <div className="p-4 bg-ivory-100 border border-border rounded-2xl">
            <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-2">
              Listing Availability Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: st })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                    formData.status === st
                      ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
                      : 'bg-white border-border text-muted-600 hover:border-dark-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              maxLength={100}
              className="input-field"
              required
            />
          </div>

          {/* Category, Condition, Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleTextChange}
                className="select-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleTextChange}
                className="select-field"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleTextChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Listing Type & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Listing Type
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleTextChange}
                className="select-field"
              >
                <option value="For Sale">For Sale</option>
                <option value="For Exchange">For Exchange</option>
              </select>
            </div>

            {formData.listingType === 'For Sale' && (
              <div>
                <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="price"
                    value={formData.price}
                    onChange={handleTextChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Exchange preference */}
          {formData.listingType === 'For Exchange' && (
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Exchange Preference
              </label>
              <input
                type="text"
                name="exchangePreference"
                value={formData.exchangePreference}
                onChange={handleTextChange}
                placeholder="What would you like to swap this for?"
                className="input-field"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              className="input-field resize-none"
              required
            />
          </div>

          {/* Image URLs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider">
                Image URLs
              </label>
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-xs font-semibold text-forest-800 hover:text-forest-900"
                >
                  + Add URL
                </button>
              )}
            </div>

            {formData.images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  className="input-field text-xs"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link to={`/listings/${id}`} className="btn-outline px-5 py-2.5">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-7 py-3 text-sm font-semibold"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
