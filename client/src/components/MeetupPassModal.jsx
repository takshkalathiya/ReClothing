import React from 'react';
import { X, Printer, ShieldCheck, MapPin, Clock, ArrowLeftRight, ShoppingBag, CheckCircle2, QrCode } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';

const MeetupPassModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const listing = request.listing || {};
  const passId = `RW-${request._id?.substring(request._id.length - 6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-dropdown border border-border overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-editorial">
                Campus Meetup Pass
              </h3>
              <p className="text-[11px] text-forest-200">
                Official ReClothing Physical Handshake Receipt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-forest-200 hover:text-white p-1.5 rounded-lg hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-6 space-y-6">
          {/* Pass ID & Status Strip */}
          <div className="flex items-center justify-between p-3.5 bg-ivory-100 rounded-2xl border border-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-500">
                Trade Pass ID
              </span>
              <p className="text-lg font-bold text-dark-900 font-mono tracking-wide">
                {passId}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
              <p className="text-[10px] text-muted-500 mt-0.5">
                Issued {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          {/* Item Card */}
          <div className="flex items-center gap-3.5 p-3.5 border border-border rounded-2xl bg-white shadow-subtle">
            <img
              src={listing.images?.[0] || 'https://via.placeholder.com/150'}
              alt={listing.title}
              className="w-16 h-16 rounded-xl object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-dark-900 truncate">
                {listing.title}
              </h4>
              <p className="text-xs text-muted-600 mt-0.5">
                Category: <strong className="text-dark-800">{listing.category}</strong>
              </p>
              <p className="text-sm font-bold text-forest-900 font-editorial mt-1">
                {request.type === 'exchange' ? 'Trade Swap' : formatCurrency(listing.price)}
              </p>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-ivory-50 rounded-xl border border-border/80">
              <span className="text-[10px] uppercase font-bold text-muted-500 block">Student Buyer</span>
              <p className="font-bold text-dark-900 mt-0.5 truncate">{request.buyer?.name}</p>
              <p className="text-[11px] text-muted-600 truncate">{request.buyer?.college}</p>
            </div>
            <div className="p-3 bg-ivory-50 rounded-xl border border-border/80">
              <span className="text-[10px] uppercase font-bold text-muted-500 block">Student Seller</span>
              <p className="font-bold text-dark-900 mt-0.5 truncate">{request.seller?.name}</p>
              <p className="text-[11px] text-muted-600 truncate">{request.seller?.college}</p>
            </div>
          </div>

          {/* Agreed Location & Time */}
          <div className="space-y-2.5 p-4 bg-forest-50/70 border border-forest-200/60 rounded-2xl text-xs text-forest-950">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
              <span>Agreed Campus Spot:</span>
              <strong className="text-dark-900 font-bold">{request.meetupLocation || 'Campus Library Front Entrance'}</strong>
            </div>

            <div className="flex items-center gap-2 font-semibold">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Scheduled Window:</span>
              <strong className="text-dark-900 font-bold">{request.preferredTime || 'Flexible daytime'}</strong>
            </div>

            {request.exchangeItemOffered && (
              <div className="flex items-center gap-2 pt-1 border-t border-forest-200/60">
                <ArrowLeftRight className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Exchanged Item Offered:</span>
                <strong className="text-dark-900 font-bold">{request.exchangeItemOffered}</strong>
              </div>
            )}
          </div>

          {/* Visual QR Code & Safety Check */}
          <div className="flex items-center gap-4 p-4 border border-border/90 rounded-2xl bg-ivory-50/50">
            <div className="w-20 h-20 bg-white p-1 rounded-xl border border-border flex items-center justify-center shrink-0">
              <QrCode className="w-16 h-16 text-dark-900" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-dark-900">Campus Safety Reminder</p>
              <p className="text-[11px] text-muted-600 leading-relaxed">
                Meet in designated well-lit public zones. Check garment sizing and condition before handing over cash or swap items.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-ivory-100 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline text-xs py-2 px-4"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary text-xs py-2 px-5 flex items-center gap-2 font-bold"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetupPassModal;
