import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Leaf, ArrowLeftRight, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
                <span className="font-editorial italic">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-forest-900 font-editorial">
                ReClothing
              </span>
            </Link>
            <p className="text-xs text-muted-600 leading-relaxed">
              "Wear More. Waste Less." A peer-to-peer campus clothing exchange and secondhand marketplace designed for sustainable college living.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-800 font-medium bg-forest-50 border border-forest-100 p-2.5 rounded-xl">
              <Leaf className="w-4 h-4 shrink-0 text-forest-700" />
              <span>Campus Sustainable Fashion Initiative</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-600">
              <li>
                <Link to="/marketplace" className="hover:text-forest-800 transition-colors">
                  All Marketplace Listings
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Clothing" className="hover:text-forest-800 transition-colors">
                  Clothing & Outerwear
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Shoes" className="hover:text-forest-800 transition-colors">
                  Shoes & Sneakers
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Bags" className="hover:text-forest-800 transition-colors">
                  Backpacks & Bags
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Books" className="hover:text-forest-800 transition-colors">
                  Academic Textbooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-900 mb-4">
              Student Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-600">
              <li>
                <Link to="/sell" className="hover:text-forest-800 transition-colors">
                  List Pre-Loved Item
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-forest-800 transition-colors">
                  Manage My Listings
                </Link>
              </li>
              <li>
                <Link to="/my-requests" className="hover:text-forest-800 transition-colors">
                  Incoming & Sent Trade Requests
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-forest-800 transition-colors">
                  My Profile & Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Sustainable Mission / Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-900 mb-4">
              Campus Safety & Reuse
            </h4>
            <div className="space-y-3 text-xs text-muted-600 leading-relaxed">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <span>Verified student accounts keep transactions local, secure, and friendly.</span>
              </p>
              <p className="flex items-start gap-2">
                <ArrowLeftRight className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Zero platform commission fees. Trade directly with peers on your campus.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-500">
          <p>© {new Date().getFullYear()} ReClothing Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College End-Term Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
