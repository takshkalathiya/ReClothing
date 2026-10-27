import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  ArrowLeftRight,
  Sparkles,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Books', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const POPULAR_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

const SAMPLE_PREVIEWS = [
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
];

const CreateListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Clothing',
    price: '',
    size: 'M',
    condition: 'Like New',
    listingType: 'For Sale',
    images: [''],
    exchangePreference: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
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

  const handlePickSampleImage = (url) => {
    const updated = [...formData.images];
    if (!updated[0] || updated[0].trim() === '') {
      updated[0] = url;
    } else if (updated.length < 4) {
      updated.push(url);
    }
    setFormData((prev) => ({ ...prev, images: updated }));
    toast.success('Sample image URL attached');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.condition) newErrors.condition = 'Please select condition';

    if (formData.listingType === 'For Sale') {
      if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        newErrors.price = 'Please enter a valid non-negative price';
      }
    }

    const validImages = formData.images.filter((img) => img.trim().length > 0);
    if (validImages.length === 0) {
      newErrors.images = 'At least one valid image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the errors highlighted in the form.');
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
        images: formData.images.filter((img) => img.trim().length > 0),
        exchangePreference: formData.exchangePreference.trim(),
      };

      const res = await listingApi.createListing(payload);
      toast.success('Listing created successfully!');
      if (res && res.data) {
        navigate(`/listings/${res.data._id}`);
      } else {
        navigate('/my-listings');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-6">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <div className="bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-card">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold mb-2">
            <PlusCircle className="w-3.5 h-3.5 text-forest-700" />
            <span>Campus Seller Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
            List an Item for Sale or Exchange
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-1">
            Give your pre-owned clothes, sneakers, or textbooks a second life within your college community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-2">
              How would you like to list this item?
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: 'For Sale' })}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.listingType === 'For Sale'
                    ? 'border-forest-800 bg-forest-50 text-forest-900 shadow-sm'
                    : 'border-border text-muted-600 hover:bg-ivory-50'
                }`}
              >
                <Tag className="w-4 h-4 text-forest-800" />
                For Sale (Cash/Venmo)
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, listingType: 'For Exchange', price: '0' })
                }
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.listingType === 'For Exchange'
                    ? 'border-forest-800 bg-forest-50 text-forest-900 shadow-sm'
                    : 'border-border text-muted-600 hover:bg-ivory-50'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
                For Exchange (Swap)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
              Listing Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTextChange}
              placeholder="e.g. Vintage Oversized Denim Jacket"
              maxLength={100}
              className={`input-field ${errors.title ? 'border-rose-400' : ''}`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category, Condition & Size in 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleTextChange}
                className="select-field"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleTextChange}
                className="select-field"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
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
                placeholder="e.g. M, US 9, Free Size"
                className="input-field"
              />
            </div>
          </div>

          {/* Price (if For Sale) */}
          {formData.listingType === 'For Sale' && (
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                Price (USD $) *
              </label>
              <div className="relative max-w-xs">
                <DollarSign className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="price"
                  value={formData.price}
                  onChange={handleTextChange}
                  placeholder="25"
                  className={`input-field pl-10 ${errors.price ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
            </div>
          )}

          {/* Exchange Preference (if For Exchange) */}
          {formData.listingType === 'For Exchange' && (
            <div>
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider mb-1.5">
                What would you like to trade for? (Optional)
              </label>
              <input
                type="text"
                name="exchangePreference"
                value={formData.exchangePreference}
                onChange={handleTextChange}
                placeholder="e.g. Looking for a fleece zip-up hoodie or art history textbook"
                maxLength={300}
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
              placeholder="Describe condition, fit, how long it was used, campus pick up availability..."
              maxLength={1500}
              className={`input-field resize-none ${errors.description ? 'border-rose-400' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
            )}
            <p className="text-[11px] text-muted-500 text-right mt-1">
              {formData.description.length}/1500 characters
            </p>
          </div>

          {/* Image URLs & Live Previews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-dark-900 uppercase tracking-wider">
                Product Image URL(s) *
              </label>
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-xs font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Another Image
                </button>
              )}
            </div>

            {formData.images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="input-field pl-10 text-xs"
                  />
                </div>
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
            {errors.images && <p className="text-xs text-rose-600">{errors.images}</p>}

            {/* Quick sample image chips */}
            <div className="pt-1">
              <span className="text-[11px] text-muted-500 block mb-1">
                Quick sample images for testing:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PREVIEWS.map((sampleUrl, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handlePickSampleImage(sampleUrl)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-ivory-200 text-dark-800 hover:bg-forest-100 hover:text-forest-900 transition-colors"
                  >
                    Use Sample #{sIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Visual Image Previews */}
            {formData.images.some((u) => u.trim().length > 0) && (
              <div className="pt-3 border-t border-border">
                <span className="text-xs font-semibold text-dark-900 block mb-2">
                  Image Previews:
                </span>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {formData.images
                    .filter((u) => u.trim().length > 0)
                    .map((url, i) => (
                      <div
                        key={i}
                        className="w-24 h-24 rounded-2xl overflow-hidden border border-border relative bg-ivory-100 shrink-0"
                      >
                        <img
                          src={url}
                          alt="Preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link to="/marketplace" className="btn-outline px-5 py-2.5">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-7 py-3 text-sm font-semibold"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Publishing Listing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
