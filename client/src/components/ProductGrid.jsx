import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

const SkeletonCard = () => (
  <div className="card-premium overflow-hidden animate-pulse flex flex-col h-full bg-white">
    <div className="aspect-[4/3] w-full bg-gray-200" />
    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
      </div>
      <div className="pt-3 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const ProductGrid = ({
  listings = [],
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No listings found',
  emptyDescription = 'There are no active products matching your filters. Try clearing some criteria!',
  onClearFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Reset Filters' : 'Explore All Listings'}
        actionLink={onClearFilters ? null : '/marketplace'}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((item) => (
        <ProductCard key={item._id} listing={item} />
      ))}
    </div>
  );
};

export default ProductGrid;
