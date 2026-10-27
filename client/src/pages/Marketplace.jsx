import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import ProductGrid from '../components/ProductGrid';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'Clothing', 'Shoes', 'Accessories', 'Bags', 'Books', 'Other'];
const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const LISTING_TYPES = ['All', 'For Sale', 'For Exchange'];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL query parameters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('listingType') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data & UI states
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change directly
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedCondition(searchParams.get('condition') || 'All');
    setSelectedSize(searchParams.get('size') || 'All');
    setSelectedType(searchParams.get('listingType') || 'All');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch listings from backend Express API
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 12,
        sort,
      };

      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCondition !== 'All') params.condition = selectedCondition;
      if (selectedSize !== 'All') params.size = selectedSize;
      if (selectedType !== 'All') params.listingType = selectedType;
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;

      const res = await listingApi.getListings(params);
      if (res && res.data) {
        setListings(res.data.listings || []);
        setPagination({
          total: res.data.total || 0,
          pages: res.data.pages || 1,
          page: res.data.page || 1,
          limit: res.data.limit || 12,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve listings.');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    sort,
    keyword,
    selectedCategory,
    selectedCondition,
    selectedSize,
    selectedType,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Apply filters and push to URL
  const applyFilters = (updates = {}) => {
    const newParams = new URLSearchParams(searchParams);

    const merged = {
      keyword,
      category: selectedCategory,
      condition: selectedCondition,
      size: selectedSize,
      listingType: selectedType,
      minPrice,
      maxPrice,
      sort,
      page: 1, // Reset to page 1 on filter change
      ...updates,
    };

    Object.keys(merged).forEach((key) => {
      const val = merged[key];
      if (val && val !== 'All' && val !== '') {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ keyword, page: 1 });
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSize('All');
    setSelectedType('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header and Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Campus Circular Wardrobe
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-900 font-editorial mt-1">
              Explore Secondhand Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-muted-600 mt-1">
              Discover verified student listings, sort by category, or filter by budget.
            </p>
          </div>

          {/* Quick stats tag */}
          <div className="text-xs font-medium text-forest-900 bg-forest-100/70 border border-forest-200 px-3.5 py-1.5 rounded-full self-start md:self-auto">
            Showing <strong className="font-bold">{pagination.total}</strong> active items
          </div>
        </div>

        {/* Search input & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-muted-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search jackets, boots, textbooks, backpacks..."
              className="input-field pl-11 pr-24 py-3 rounded-2xl shadow-subtle text-sm"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  applyFilters({ keyword: '', page: 1 });
                }}
                className="absolute right-16 top-3 text-muted-400 hover:text-dark-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-forest-800 text-white text-xs font-medium hover:bg-forest-900 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filter button for mobile */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden btn-outline py-3 px-4 rounded-2xl flex items-center gap-2"
          >
            <Filter className="w-4 h-4 text-forest-800" />
            <span className="text-xs font-semibold">Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-800" />
                <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
                  Filter Catalog
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-muted-600 hover:text-forest-800 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2.5">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      applyFilters({ category: cat, page: 1 });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-forest-100 text-forest-900 font-bold'
                        : 'text-muted-600 hover:bg-ivory-100 hover:text-dark-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
                Listing Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {LISTING_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedType(type);
                      applyFilters({ listingType: type, page: 1 });
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedType === type
                        ? 'border-forest-800 bg-forest-50 text-forest-900 font-bold shadow-sm'
                        : 'border-border bg-white text-muted-600 hover:bg-ivory-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
                Item Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => {
                  setSelectedCondition(e.target.value);
                  applyFilters({ condition: e.target.value, page: 1 });
                }}
                className="select-field text-xs py-2"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond === 'All' ? 'All Conditions' : cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
                Clothing Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSize(s);
                      applyFilters({ size: s, page: 1 });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedSize === s
                        ? 'bg-forest-800 border-forest-800 text-white'
                        : 'bg-white border-border text-muted-600 hover:border-dark-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider mb-2">
                Price Range ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field text-xs py-2 px-3"
                />
                <span className="text-muted-400 text-xs">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field text-xs py-2 px-3"
                />
              </div>
              <button
                type="button"
                onClick={() => applyFilters({ minPrice, maxPrice, page: 1 })}
                className="w-full btn-outline text-xs py-2 mt-2 font-medium"
              >
                Apply Price
              </button>
            </div>
          </div>
        </aside>

        {/* Main Product Listings Column */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting and Results Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-border shadow-subtle">
            <p className="text-xs text-muted-600">
              Showing page <strong className="text-dark-900">{pagination.page}</strong> of{' '}
              <strong className="text-dark-900">{pagination.pages}</strong> ({pagination.total} items)
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-dark-900 uppercase tracking-wider">
                Sort by:
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  applyFilters({ sort: e.target.value, page: 1 });
                }}
                className="select-field text-xs py-1.5 px-3 w-auto font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Error Message if fetch failed */}
          {error && <ErrorMessage message={error} onRetry={fetchListings} />}

          {/* Product Grid */}
          {!error && (
            <ProductGrid
              listings={listings}
              loading={loading}
              skeletonCount={8}
              emptyTitle="No items match your criteria"
              emptyDescription="Try clearing some filters or searching with different terms."
              onClearFilters={handleResetFilters}
            />
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-outline px-3 py-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.pages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => handlePageChange(pNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                        pagination.page === pNum
                          ? 'bg-forest-800 text-white shadow-sm'
                          : 'bg-white border border-border text-dark-800 hover:bg-ivory-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn-outline px-3 py-2 text-xs"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-dropdown">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-dark-900 font-editorial">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5"
              >
                <X className="w-5 h-5 text-dark-900" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-900 mb-2">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      applyFilters({ category: cat, page: 1 });
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs ${
                      selectedCategory === cat
                        ? 'bg-forest-100 text-forest-900 font-bold'
                        : 'text-muted-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Listing Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-900 mb-2">
                Listing Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LISTING_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedType(type);
                      applyFilters({ listingType: type, page: 1 });
                      setMobileFilterOpen(false);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border ${
                      selectedType === type
                        ? 'border-forest-800 bg-forest-50 text-forest-900 font-bold'
                        : 'border-border text-muted-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear all */}
            <button
              type="button"
              onClick={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full btn-outline text-xs py-2.5 justify-center"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
