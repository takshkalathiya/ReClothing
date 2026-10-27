import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeftRight, Tag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80';

const ProductCard = ({ listing }) => {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const [imgSrc, setImgSrc] = useState(
    listing.images?.[0] || FALLBACK_IMAGE
  );

  const isFavorited = isInWishlist(listing._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing._id);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Like New':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Good':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Fair':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="group card-premium hover:shadow-card-hover overflow-hidden flex flex-col h-full bg-white transition-all duration-300">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-200">
        <Link to={`/listings/${listing._id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={listing.title}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Listing Type & Condition Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`badge text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm ${
              listing.listingType === 'For Exchange'
                ? 'bg-emerald-800/90 text-white'
                : 'bg-dark-900/90 text-white'
            }`}
          >
            {listing.listingType === 'For Exchange' ? (
              <>
                <ArrowLeftRight className="w-3 h-3 inline mr-0.5" /> Exchange
              </>
            ) : (
              <>
                <Tag className="w-3 h-3 inline mr-0.5" /> For Sale
              </>
            )}
          </span>

          <span
            className={`badge text-[11px] font-medium border backdrop-blur-md ${getConditionColor(
              listing.condition
            )}`}
          >
            {listing.condition}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-dark-900 shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited
                ? 'fill-rose-500 text-rose-500'
                : 'text-dark-800 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Status Overlays if not active */}
        {listing.status && listing.status !== 'active' && (
          <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-dark-900 shadow-lg">
              {listing.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-500 mb-1.5">
            <span className="font-medium text-forest-800 uppercase tracking-wider text-[11px]">
              {listing.category}
            </span>
            {listing.size && listing.size !== 'N/A' && (
              <span className="px-2 py-0.5 rounded-md bg-ivory-200 text-dark-800 font-semibold text-[11px]">
                Size {listing.size}
              </span>
            )}
          </div>

          <Link
            to={`/listings/${listing._id}`}
            className="block group-hover:text-forest-800 transition-colors"
          >
            <h3 className="text-base font-semibold text-dark-900 line-clamp-1">
              {listing.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-600 line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Seller Info & Price Footer */}
        <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {listing.seller?.avatar ? (
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-6 h-6 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-[10px] font-bold">
                {listing.seller?.name?.charAt(0) || <User className="w-3 h-3" />}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-dark-900 truncate">
                {listing.seller?.name || 'Campus Student'}
              </p>
              <p className="text-[10px] text-muted-500 truncate">
                {listing.seller?.college || 'College Campus'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-forest-900">
              {formatCurrency(listing.price, listing.listingType)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
