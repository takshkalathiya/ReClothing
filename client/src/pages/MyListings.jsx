import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await listingApi.getMyListings();
      if (res && res.data) {
        setListings(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to retrieve your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleOpenDelete = (listing) => {
    setListingToDelete(listing);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    setDeleting(true);
    try {
      await listingApi.deleteListing(listingToDelete._id);
      setListings((prev) => prev.filter((item) => item._id !== listingToDelete._id));
      toast.success('Listing deleted successfully.');
      setDeleteModalOpen(false);
      setListingToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to remove listing.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-status-active">Active</span>;
      case 'reserved':
        return <span className="badge badge-status-reserved">Reserved</span>;
      case 'sold':
        return <span className="badge badge-status-sold">Sold</span>;
      case 'exchanged':
        return <span className="badge badge-status-exchanged">Exchanged</span>;
      default:
        return <span className="badge bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your listings..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Seller Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial mt-1">
            My Campus Listings
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-1">
            You currently have <strong className="text-dark-900">{listings.length}</strong> listed items.
          </p>
        </div>

        <Link to="/sell" className="btn-primary self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Listings List */}
      {listings.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="You haven't listed any items yet"
          description="Have clothing, sneakers, or textbooks you no longer use? List them now to earn cash or swap with classmates."
          actionText="List Your First Item"
          actionLink="/sell"
        />
      ) : (
        <div className="space-y-4">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-card transition-all"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.images?.[0] || FALLBACK_IMAGE}
                  alt={item.title}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-border shrink-0 bg-ivory-100"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {getStatusBadge(item.status)}
                    <span className="badge bg-ivory-200 text-dark-800 text-[11px]">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold uppercase text-forest-800">
                      {item.listingType}
                    </span>
                  </div>

                  <Link
                    to={`/listings/${item._id}`}
                    className="text-base font-bold text-dark-900 hover:text-forest-800 transition-colors block truncate"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-muted-600 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-400" />
                    <span>Listed on {formatDate(item.createdAt)}</span>
                    {item.size && item.size !== 'N/A' && (
                      <>
                        <span>•</span>
                        <span>Size {item.size}</span>
                      </>
                    )}
                  </p>

                  <p className="text-sm font-bold text-forest-900 mt-1">
                    {formatCurrency(item.price, item.listingType)}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                <Link
                  to={`/listings/${item._id}`}
                  className="btn-ghost p-2 text-dark-800 hover:text-forest-800"
                  title="View Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  to={`/listings/${item._id}/edit`}
                  className="btn-outline text-xs px-3 py-2 flex items-center gap-1.5 font-medium"
                >
                  <Edit className="w-3.5 h-3.5 text-forest-800" />
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenDelete(item)}
                  className="btn-danger text-xs px-3 py-2 flex items-center gap-1.5 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Listing"
        message={`Are you sure you want to permanently delete "${listingToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Item"
        isDanger={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default MyListings;
