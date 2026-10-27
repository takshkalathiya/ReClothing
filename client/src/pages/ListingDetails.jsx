import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  ArrowLeftRight,
  ShieldCheck,
  Tag,
  Calendar,
  School,
  User,
  Sparkles,
  Edit,
  Info,
  Eye,
  Share2,
  MessageCircleQuestion,
  Send,
  Star,
  MessageSquare,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import RequestModal from '../components/RequestModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist, isInWishlist } = useAuth();

  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('purchase');

  // Q&A state
  const [newQuestion, setNewQuestion] = useState('');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // Seller reviews state
  const [sellerReviews, setSellerReviews] = useState({ reviews: [], totalReviews: 0, averageRating: 5.0 });

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listingApi.getListingById(id);
      if (res && res.data) {
        setListing(res.data);
        if (res.data.seller?._id) {
          reviewApi.getSellerReviews(res.data.seller._id)
            .then((r) => {
              if (r && r.data) {
                setSellerReviews(r.data);
              }
            })
            .catch(() => {});
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ErrorMessage
          message={error || 'This listing does not exist or may have been removed.'}
          onRetry={fetchListing}
        />
        <Link to="/marketplace" className="btn-outline mt-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === listing.seller?._id;
  const isAvailable = listing.status === 'active';
  const isFavorited = isInWishlist(listing._id);

  const handleOpenRequest = (type) => {
    if (!user) {
      toast.error('Please log in to contact the seller.');
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }
    setRequestType(type);
    setModalOpen(true);
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setSubmittingQuestion(true);
      const res = await listingApi.addQuestion(id, newQuestion.trim());
      toast.success(res.message || 'Question submitted!');
      setNewQuestion('');
      await fetchListing();
    } catch (err) {
      toast.error(err.message || 'Failed to submit question.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      const res = await listingApi.answerQuestion(id, questionId, answerText.trim());
      toast.success(res.message || 'Answer posted!');
      setAnsweringQuestionId(null);
      setAnswerText('');
      await fetchListing();
    } catch (err) {
      toast.error(err.message || 'Failed to post answer.');
    }
  };

  const images = listing.images?.length > 0 ? listing.images : [FALLBACK_IMAGE];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Top action strip: Back button + Live Views & Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-border text-xs text-muted-600 font-medium">
            <Eye className="w-3.5 h-3.5 text-forest-700" />
            <span>{listing.viewsCount || 1} campus views</span>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Listing link copied to clipboard!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-ivory-100 border border-border text-xs font-semibold text-dark-900 transition-colors shadow-subtle"
          >
            <Share2 className="w-3.5 h-3.5 text-forest-800" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-ivory-200 border border-border shadow-card">
            <img
              src={images[selectedImage] || FALLBACK_IMAGE}
              alt={listing.title}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="badge bg-dark-900/90 text-white backdrop-blur-md text-xs px-3 py-1 font-semibold uppercase">
                {listing.listingType}
              </span>
              <span className="badge bg-white/90 text-dark-900 backdrop-blur-md text-xs px-3 py-1 font-semibold border border-border">
                {listing.condition} Condition
              </span>
              {listing.status !== 'active' && (
                <span className="badge bg-amber-500 text-white font-bold uppercase tracking-wider text-xs px-3 py-1 shadow-md">
                  {listing.status}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(listing._id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur-md text-dark-900 shadow-md hover:scale-105 active:scale-95 transition-all"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-dark-800'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-forest-800 ring-2 ring-forest-800/20'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest-800 uppercase tracking-wider mb-2">
              <span>{listing.category}</span>
              {listing.size && listing.size !== 'N/A' && (
                <>
                  <span>•</span>
                  <span>Size {listing.size}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial leading-tight">
              {listing.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-forest-900 font-editorial">
                {formatCurrency(listing.price, listing.listingType)}
              </span>
              {listing.listingType === 'For Exchange' && (
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Available for trade
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {isOwner ? (
              <div className="p-4 bg-forest-50 border border-forest-200 rounded-2xl space-y-3">
                <p className="text-xs font-semibold text-forest-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-forest-700" />
                  You are the owner of this campus listing.
                </p>
                <div className="flex gap-2">
                  <Link to={`/listings/${listing._id}/edit`} className="btn-primary flex-1 text-xs py-2.5">
                    <Edit className="w-4 h-4" />
                    Edit Listing Details
                  </Link>
                  <Link to="/my-listings" className="btn-outline flex-1 text-xs py-2.5">
                    View My Listings
                  </Link>
                </div>
              </div>
            ) : isAvailable ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenRequest('purchase')}
                    className="btn-primary py-3 text-sm justify-center shadow-card font-semibold"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Send Purchase Request
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRequest('exchange')}
                    className="btn-secondary py-3 text-sm justify-center font-semibold border border-forest-200"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Send Exchange Request
                  </button>
                </div>

                {/* Direct Campus Messenger Action */}
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.error('Please sign in to chat with the seller.');
                      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
                      return;
                    }
                    navigate(`/messages?user=${listing.seller?._id}&listing=${listing._id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-forest-800 text-forest-800 hover:bg-forest-50 font-semibold text-xs transition-colors shadow-subtle"
                >
                  <MessageSquare className="w-4 h-4 text-forest-800" />
                  <span>Chat Directly with Seller</span>
                </button>

                <p className="text-[11px] text-muted-500 text-center">
                  Submitting a request contacts the student seller directly on campus.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Item Currently {listing.status}
                </p>
                <p className="text-xs text-muted-600 mt-1">
                  This item has already been reserved, sold, or exchanged by another student.
                </p>
              </div>
            )}
          </div>

          {/* Exchange Preference Alert if any */}
          {listing.exchangePreference && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Seller's Trade Preference
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {listing.exchangePreference}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-dark-800 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Category</span>
              <span className="font-semibold text-dark-900">{listing.category}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Condition</span>
              <span className="font-semibold text-dark-900">{listing.condition}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Size</span>
              <span className="font-semibold text-dark-900">{listing.size || 'N/A'}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border">
              <span className="text-muted-500 block text-[11px]">Listed Date</span>
              <span className="font-semibold text-dark-900">{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-subtle flex items-center gap-4">
            {listing.seller?.avatar ? (
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-base">
                {listing.seller?.name?.charAt(0) || <User className="w-6 h-6" />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-dark-900 truncate">
                  {listing.seller?.name || 'Campus Student'}
                </h4>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-dark-900">
                    {sellerReviews.totalReviews > 0 ? sellerReviews.averageRating : '5.0'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-600 flex items-center gap-1 mt-0.5">
                <School className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span className="truncate">{listing.seller?.college || 'College Campus'}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-500">
                  Member since {formatDate(listing.seller?.createdAt)}
                </span>
                <span className="text-[10px] text-muted-400">•</span>
                <span className="text-[10px] text-forest-800 font-semibold">
                  {sellerReviews.totalReviews} campus {sellerReviews.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </div>

          {/* Campus Non-Payment Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>ReClothing Campus Note:</strong> Requests signal intent to buy or trade. No online credit card transactions occur on ReClothing. Always meet peers in verified public campus areas.
            </span>
          </div>
        </div>
      </div>

      {/* Community Questions & Answers Section */}
      <div className="mt-12 bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-dark-900 font-editorial flex items-center gap-2">
              <MessageCircleQuestion className="w-5 h-5 text-forest-800" />
              <span>Campus Community Q&A</span>
            </h3>
            <p className="text-xs text-muted-500 mt-0.5">
              Have questions about sizing, wear, or campus meetup? Ask the seller publicly.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-ivory-100 rounded-lg text-dark-800 self-start sm:self-auto">
            {listing.questions?.length || 0} {listing.questions?.length === 1 ? 'Question' : 'Questions'}
          </span>
        </div>

        {/* Post Question Form */}
        {user ? (
          <form onSubmit={handlePostQuestion} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask about measurements, fabric, or pickup (e.g. Does it fit oversized?)..."
                maxLength={300}
                className="input-field text-xs flex-1"
                disabled={submittingQuestion}
              />
              <button
                type="submit"
                disabled={submittingQuestion || !newQuestion.trim()}
                className="btn-primary text-xs px-4 py-2 shrink-0 font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingQuestion ? 'Posting...' : 'Ask'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-ivory-50 border border-border/80 rounded-xl text-xs text-muted-600 flex items-center justify-between">
            <span>Have a question about this item? Sign in to ask the seller publicly.</span>
            <Link to="/login" className="btn-outline text-xs py-1 px-3">
              Sign In
            </Link>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4 pt-2">
          {listing.questions && listing.questions.length > 0 ? (
            listing.questions.map((q) => (
              <div key={q._id} className="p-4 bg-ivory-50/70 border border-border/80 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-forest-800 text-white text-[10px] font-bold flex items-center justify-center">
                    {q.userName?.charAt(0) || 'S'}
                  </div>
                  <span className="text-xs font-bold text-dark-900">{q.userName}</span>
                  <span className="text-[10px] text-muted-500">• {formatDate(q.createdAt)}</span>
                </div>

                <p className="text-xs text-dark-800 pl-8">
                  <strong>Q:</strong> {q.question}
                </p>

                {/* Answer if present */}
                {q.answer ? (
                  <div className="ml-8 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-950 space-y-1">
                    <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
                      <span>Seller Response:</span>
                    </p>
                    <p>{q.answer}</p>
                  </div>
                ) : (isOwner || user?.role === 'admin' || user?.email?.toLowerCase() === 'sanskarbhanderi08@gmail.com') ? (
                  <div className="ml-8 pt-1">
                    {answeringQuestionId === q._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Type your answer to this student..."
                          className="input-field text-xs flex-1 bg-white"
                          maxLength={500}
                        />
                        <button
                          type="button"
                          onClick={() => handleAnswerQuestion(q._id)}
                          className="btn-primary text-xs px-3 py-1.5"
                        >
                          Submit Answer
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnsweringQuestionId(null)}
                          className="btn-outline text-xs px-2.5 py-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAnsweringQuestionId(q._id);
                          setAnswerText('');
                        }}
                        className="text-xs font-semibold text-forest-800 hover:text-forest-900 underline"
                      >
                        Reply as Seller →
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-500 italic py-2">
              No questions asked yet. Be the first classmate to inquire!
            </p>
          )}
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={listing}
        initialType={requestType}
        onSuccess={fetchListing}
      />
    </div>
  );
};

export default ListingDetails;
