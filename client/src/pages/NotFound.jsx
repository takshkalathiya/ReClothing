import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-dark-900 font-editorial mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-muted-600 max-w-md mb-8 leading-relaxed">
        The campus listing, profile, or link you are searching for might have been moved or removed.
      </p>
      <Link to="/marketplace" className="btn-primary">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
};

export default NotFound;
