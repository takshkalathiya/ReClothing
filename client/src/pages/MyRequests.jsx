import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Inbox,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  Ban,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { requestApi } from '../api/requestApi';
import { formatDate, timeAgo } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import MeetupPassModal from '../components/MeetupPassModal';
import ReviewModal from '../components/ReviewModal';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80';

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Meetup Pass Modal state
  const [selectedPassRequest, setSelectedPassRequest] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // Review Modal state
  const [reviewModalData, setReviewModalData] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [sentRes, receivedRes] = await Promise.all([
        requestApi.getSentRequests(),
        requestApi.getReceivedRequests(),
      ]);

      if (sentRes && sentRes.data) setSentRequests(sentRes.data);
      if (receivedRes && receivedRes.data) setReceivedRequests(receivedRes.data);
    } catch (err) {
      toast.error(err.message || 'Failed to retrieve trade requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      const res = await requestApi.acceptRequest(requestId);
      toast.success(res.message || 'Request accepted! Listing status updated.');
      await fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Could not accept this request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      const res = await requestApi.rejectRequest(requestId);
      toast.success('Request rejected.');
      await fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Could not reject request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await requestApi.cancelRequest(requestId);
      toast.success('Your request was cancelled.');
      await fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Could not cancel request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="badge bg-emerald-100 text-emerald-800 border-emerald-300">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="badge bg-rose-50 text-rose-700 border-rose-200">
            <XCircle className="w-3 h-3 inline mr-1" />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge bg-gray-100 text-gray-600 border-gray-200">
            <Ban className="w-3 h-3 inline mr-1" />
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="badge bg-amber-50 text-amber-800 border-amber-200">
            <Clock className="w-3 h-3 inline mr-1" />
            Pending Response
          </span>
        );
    }
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
          Peer-to-Peer Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial mt-1">
          Campus Trade Requests
        </h1>
        <p className="text-xs sm:text-sm text-muted-600 mt-1">
          Review incoming purchase proposals from classmates or check status on items you requested.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'received'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white border border-border text-muted-600 hover:text-dark-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Requests Received ({receivedRequests.length})</span>
            {pendingReceivedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-dark-900 text-[10px] font-black">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'sent'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white border border-border text-muted-600 hover:text-dark-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Requests I Sent ({sentRequests.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading trade requests..." />
        </div>
      ) : activeTab === 'received' ? (
        /* Requests Received (Seller Perspective) */
        receivedRequests.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No incoming requests yet"
            description="When classmates request to buy or swap one of your listings, their messages will appear here."
            actionText="Browse Marketplace"
            actionLink="/marketplace"
          />
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-border rounded-2xl p-5 hover:shadow-card transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Product & Buyer Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={req.listing?.images?.[0] || FALLBACK_IMAGE}
                      alt={req.listing?.title}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className="w-16 h-16 rounded-xl object-cover border border-border shrink-0 bg-ivory-100"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getStatusBadge(req.status)}
                        <span className="badge text-[10px] uppercase font-bold bg-ivory-200 text-forest-900">
                          {req.type === 'purchase' ? 'Purchase Request' : 'Exchange Proposal'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-dark-900">
                        {req.listing?.title || 'Listing item'}
                      </h3>

                      <p className="text-xs text-muted-600 flex items-center gap-1.5 mt-0.5">
                        <span>Buyer:</span>
                        <strong className="text-dark-900">{req.buyer?.name}</strong>
                        <span>({req.buyer?.college})</span>
                        <span>•</span>
                        <span>{timeAgo(req.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-forest-900 font-editorial">
                      {formatCurrency(req.listing?.price, req.listing?.listingType)}
                    </span>
                  </div>
                </div>

                {/* Proposed Campus Meetup & Offer Strip */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                  {req.meetupLocation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-50 text-forest-800 font-medium border border-forest-200/60">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      <span>{req.meetupLocation}</span>
                    </span>
                  )}
                  {req.preferredTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ivory-100 text-dark-800 font-medium border border-border">
                      <Clock className="w-3.5 h-3.5 text-muted-500" />
                      <span>{req.preferredTime}</span>
                    </span>
                  )}
                  {req.exchangeItemOffered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Trade Item: {req.exchangeItemOffered}</span>
                    </span>
                  )}
                </div>

                {/* Personal Message from Buyer */}
                {req.message && (
                  <div className="mt-3 p-3.5 bg-ivory-100 border border-border/80 rounded-xl text-xs text-dark-800 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-dark-900">Buyer Note: </span>
                      <span>"{req.message}"</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons if Pending */}
                {req.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleReject(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="btn-outline text-xs px-4 py-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="btn-primary text-xs px-5 py-2 font-semibold"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {actionLoadingId === req._id ? 'Updating...' : 'Accept Request'}
                    </button>
                  </div>
                )}

                {/* Status notice & Meetup Pass if accepted */}
                {req.status === 'accepted' && (
                  <div className="mt-3.5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-emerald-800 font-medium">
                      ✓ You accepted this request. Coordinate campus meetup at <strong className="text-dark-900">{req.buyer?.email || 'student email'}</strong>.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPassRequest(req);
                        setPassModalOpen(true);
                      }}
                      className="btn-outline text-xs px-3.5 py-1.5 border-forest-800 text-forest-800 hover:bg-forest-50 font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      View Meetup Pass
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Requests Sent (Buyer Perspective) */
        sentRequests.length === 0 ? (
          <EmptyState
            icon={Send}
            title="You haven't sent any requests yet"
            description="Found an item you like on the campus marketplace? Click 'Send Purchase Request' or 'Send Exchange Request' to propose a trade!"
            actionText="Explore Marketplace"
            actionLink="/marketplace"
          />
        ) : (
          <div className="space-y-4">
            {sentRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-border rounded-2xl p-5 hover:shadow-card transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={req.listing?.images?.[0] || FALLBACK_IMAGE}
                      alt={req.listing?.title}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className="w-16 h-16 rounded-xl object-cover border border-border shrink-0 bg-ivory-100"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {getStatusBadge(req.status)}
                        <span className="badge text-[10px] uppercase font-bold bg-ivory-200 text-forest-900">
                          {req.type}
                        </span>
                      </div>

                      <Link
                        to={`/listings/${req.listing?._id}`}
                        className="text-base font-bold text-dark-900 hover:text-forest-800 transition-colors block"
                      >
                        {req.listing?.title || 'Listing item'}
                      </Link>

                      <p className="text-xs text-muted-600 flex items-center gap-1.5 mt-0.5">
                        <span>Seller:</span>
                        <strong className="text-dark-900">{req.seller?.name}</strong>
                        <span>({req.seller?.college})</span>
                        <span>•</span>
                        <span>Sent {timeAgo(req.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-forest-900 font-editorial">
                      {formatCurrency(req.listing?.price, req.listing?.listingType)}
                    </span>
                  </div>
                </div>

                {/* Proposed Campus Meetup & Offer Strip */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                  {req.meetupLocation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-50 text-forest-800 font-medium border border-forest-200/60">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      <span>{req.meetupLocation}</span>
                    </span>
                  )}
                  {req.preferredTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ivory-100 text-dark-800 font-medium border border-border">
                      <Clock className="w-3.5 h-3.5 text-muted-500" />
                      <span>{req.preferredTime}</span>
                    </span>
                  )}
                  {req.exchangeItemOffered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Offered to Swap: {req.exchangeItemOffered}</span>
                    </span>
                  )}
                </div>

                {req.message && (
                  <div className="mt-3 p-3 bg-ivory-100 border border-border/80 rounded-xl text-xs text-dark-800">
                    <span className="font-semibold text-dark-900">Your Message: </span>
                    <span>"{req.message}"</span>
                  </div>
                )}

                {/* Cancel option if still pending */}
                {req.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-border flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCancel(req._id)}
                      disabled={actionLoadingId === req._id}
                      className="btn-outline text-xs px-3.5 py-1.5 text-rose-700 border-rose-300 hover:bg-rose-50"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Cancel Request
                    </button>
                  </div>
                )}

                {/* Accepted actions for Buyer: Meetup Pass & Rate Seller */}
                {req.status === 'accepted' && (
                  <div className="mt-3.5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Accepted by Seller! Ready for Campus Handshake.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPassRequest(req);
                          setPassModalOpen(true);
                        }}
                        className="btn-outline text-xs px-3.5 py-1.5 border-forest-800 text-forest-800 hover:bg-forest-50 font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        View Meetup Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReviewModalData({
                            sellerId: req.seller?._id,
                            listingId: req.listing?._id,
                            sellerName: req.seller?.name,
                            listingTitle: req.listing?.title,
                          });
                          setReviewModalOpen(true);
                        }}
                        className="btn-primary text-xs px-3.5 py-1.5 font-semibold"
                      >
                        <Star className="w-3.5 h-3.5 mr-1 fill-amber-300 text-amber-300" />
                        Rate Seller
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Meetup Pass Modal */}
      <MeetupPassModal
        isOpen={passModalOpen}
        onClose={() => {
          setPassModalOpen(false);
          setSelectedPassRequest(null);
        }}
        request={selectedPassRequest}
      />

      {/* Seller Review Modal */}
      {reviewModalData && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewModalData(null);
          }}
          sellerId={reviewModalData.sellerId}
          listingId={reviewModalData.listingId}
          sellerName={reviewModalData.sellerName}
          listingTitle={reviewModalData.listingTitle}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};

export default MyRequests;
