import React, { useState } from 'react';
import { X, Star, Send, Award } from 'lucide-react';
import { reviewApi } from '../api/reviewApi';
import toast from 'react-hot-toast';

const AVAILABLE_TAGS = [
  '⚡ Fast Responder',
  '📦 Item as Described',
  '🤝 Friendly Meetup',
  '⏱️ Punctual',
  '💯 Highly Recommended',
  '🌟 Great Condition',
];

const ReviewModal = ({ isOpen, onClose, sellerId, listingId, sellerName, listingTitle, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['⚡ Fast Responder', '📦 Item as Described']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await reviewApi.createReview({
        sellerId,
        listingId,
        rating,
        comment: comment.trim(),
        tags: selectedTags,
      });

      toast.success(res.message || 'Review submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-dropdown border border-border p-6 space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Campus Peer Feedback
            </span>
            <h3 className="text-lg font-bold text-dark-900 mt-0.5">
              Rate {sellerName || 'Seller'}
            </h3>
            {listingTitle && (
              <p className="text-xs text-muted-500 truncate mt-0.5">
                Item: {listingTitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-muted-500 hover:text-dark-900 p-1.5 rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Picker */}
          <div className="text-center py-2">
            <span className="text-xs font-semibold text-muted-600 block mb-2">
              Tap stars to rate your trade experience:
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-dark-900 mt-1.5">
              {rating === 5 ? 'Excellent & Trustworthy' : `${rating} out of 5 stars`}
            </p>
          </div>

          {/* Quick Tag Badges */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
              Compliment Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      active
                        ? 'bg-forest-100 border-forest-300 text-forest-900 font-bold'
                        : 'bg-ivory-50 border-border text-muted-600 hover:bg-ivory-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Comment */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1.5">
              Feedback Comment (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Jacket arrived exactly as described, seller was on time at the library!"
              maxLength={500}
              className="input-field text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-outline px-4 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2 text-xs flex items-center gap-1.5 font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
