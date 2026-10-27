import React, { useState } from 'react';
import { X, Send, ShoppingBag, ArrowLeftRight, Info, MapPin, Clock, PackageCheck } from 'lucide-react';
import { requestApi } from '../api/requestApi';
import toast from 'react-hot-toast';

const CAMPUS_LOCATIONS = [
  'Campus Library Front Entrance (Recommended)',
  'Student Center & Dining Commons',
  'North Academic Quad / Science Hall',
  'Athletics & Recreation Complex',
  'Main Campus Transit Hub & Gate',
  'Residence Hall Central Lounge',
];

const TIME_SLOTS = [
  'Flexible / Any Daytime Slot',
  'Today After Class (4:00 PM - 6:00 PM)',
  'Tomorrow Morning (10:00 AM - 12:00 PM)',
  'Tomorrow Afternoon (1:00 PM - 3:30 PM)',
  'Weekend Campus Meetup',
];

const RequestModal = ({ isOpen, onClose, listing, onSuccess, initialType = 'purchase' }) => {
  const [type, setType] = useState(initialType);
  const [message, setMessage] = useState('');
  const [meetupLocation, setMeetupLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [exchangeItemOffered, setExchangeItemOffered] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await requestApi.createRequest({
        listingId: listing._id,
        type,
        message: message.trim(),
        meetupLocation,
        preferredTime,
        exchangeItemOffered: type === 'exchange' ? exchangeItemOffered.trim() : '',
      });

      toast.success(res.message || 'Request sent successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-dropdown border border-border p-6 overflow-hidden max-h-[92vh] overflow-y-auto"
        role="dialog"
      >
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700">
              Campus Trade Proposal
            </span>
            <h3 className="text-xl font-bold text-dark-900 mt-0.5">
              Contact Seller for {listing.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-500 hover:text-dark-900 p-1.5 rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product summary card */}
        <div className="flex items-center gap-3.5 p-3.5 my-4 bg-ivory-100 rounded-2xl border border-border">
          <img
            src={listing.images?.[0] || 'https://via.placeholder.com/150'}
            alt={listing.title}
            className="w-16 h-16 object-cover rounded-xl border border-border/80"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-dark-900 truncate">{listing.title}</h4>
            <p className="text-xs text-muted-600 mt-0.5">
              Seller: <span className="font-medium text-dark-900">{listing.seller?.name}</span> ({listing.seller?.college})
            </p>
            <p className="text-sm font-bold text-forest-800 mt-1">
              {listing.listingType === 'For Exchange' ? 'For Exchange' : `$${listing.price}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select request type tabs */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
              Request Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('purchase')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                  type === 'purchase'
                    ? 'border-forest-800 bg-forest-50 text-forest-900 shadow-sm'
                    : 'border-border bg-white text-muted-600 hover:bg-ivory-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-forest-800" />
                Purchase Request
              </button>
              <button
                type="button"
                onClick={() => setType('exchange')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                  type === 'exchange'
                    ? 'border-forest-800 bg-forest-50 text-forest-900 shadow-sm'
                    : 'border-border bg-white text-muted-600 hover:bg-ivory-50'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
                Exchange / Swap
              </button>
            </div>
          </div>

          {/* Exchange item offered input */}
          {type === 'exchange' && (
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <PackageCheck className="w-4 h-4 text-emerald-700" />
                <span>What are you offering to swap?</span>
              </div>
              {listing.exchangePreference && (
                <p className="text-xs text-emerald-800/90 italic">
                  Seller’s preference: "{listing.exchangePreference}"
                </p>
              )}
              <input
                type="text"
                value={exchangeItemOffered}
                onChange={(e) => setExchangeItemOffered(e.target.value)}
                placeholder="e.g., Vintage Levi's Denim Jacket (Size M) or Nike Air Force 1s"
                className="input-field text-xs bg-white"
                required={type === 'exchange'}
              />
            </div>
          )}

          {/* Campus Meetup Location & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest-700" />
                <span>Campus Meetup Spot</span>
              </label>
              <select
                value={meetupLocation}
                onChange={(e) => setMeetupLocation(e.target.value)}
                className="input-field text-xs"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Preferred Time Slot</span>
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="input-field text-xs"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message input */}
          <div>
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-1.5">
              Personal Note to Seller
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === 'purchase'
                  ? 'Hi! I would like to purchase this item. Let me know if the meetup spot works for you!'
                  : 'Hi! I would love to trade this item. Let me know what you think!'
              }
              maxLength={500}
              className="input-field resize-none text-xs"
            />
            <p className="text-[11px] text-muted-500 text-right mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Safety disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 leading-normal">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Campus Handshake:</strong> All transactions take place in-person on campus. Inspect the item thoroughly before handoff.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-outline px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2.5"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending Proposal...' : 'Send Trade Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
