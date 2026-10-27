import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Leaf,
  ArrowLeftRight,
  ShoppingBag,
  TrendingUp,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { listingApi } from '../api/listingApi';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../context/AuthContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_HERO = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';

const categories = [
  { name: 'Clothing', icon: Tag, count: 'Outerwear, tees, knitwear', query: 'Clothing' },
  { name: 'Shoes', icon: ShoppingBag, count: 'Sneakers, boots, flats', query: 'Shoes' },
  { name: 'Bags', icon: ShoppingBag, count: 'Backpacks, totes, messengers', query: 'Bags' },
  { name: 'Accessories', icon: Sparkles, count: 'Caps, sunglasses, jewelry', query: 'Accessories' },
  { name: 'Books', icon: ShieldCheck, count: 'Course textbooks, novels', query: 'Books' },
  { name: 'Other', icon: ArrowLeftRight, count: 'Tech, study gear, bottles', query: 'Other' },
];

const Home = () => {
  const { user } = useAuth();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImg, setHeroImg] = useState(HERO_IMAGE);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await listingApi.getFeaturedListings();
        if (res && res.data) {
          setFeaturedListings(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100/90 border border-forest-200 text-forest-900 text-xs font-semibold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-forest-700" />
                <span>The Student Secondhand & Exchange Movement</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-dark-900 font-editorial leading-[1.15]">
                Good Style Deserves a{' '}
                <span className="italic font-normal text-forest-800">Second Life.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-600 max-w-xl leading-relaxed">
                Discover pre-loved fashion, find affordable favorites, and give great items a new home right on your college campus.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link to="/marketplace" className="btn-primary text-base px-6 py-3">
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={user ? '/sell' : '/login'}
                  className="btn-outline text-base px-6 py-3"
                >
                  <span>List an Item</span>
                </Link>
              </div>

              {/* Trust stats strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
                <div>
                  <p className="text-2xl font-bold text-forest-900 font-editorial">100%</p>
                  <p className="text-xs text-muted-600">Student-to-student</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-forest-900 font-editorial">$0</p>
                  <p className="text-xs text-muted-600">Transaction fees</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-forest-900 font-editorial">Zero</p>
                  <p className="text-xs text-muted-600">Landfill fashion waste</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-card border border-border bg-ivory-200">
                  <img
                    src={heroImg}
                    alt="Campus Sustainable Fashion"
                    onError={() => setHeroImg(FALLBACK_HERO)}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-border p-4 rounded-2xl shadow-dropdown max-w-xs animate-fade-in hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark-900">Exchange or Thrift</p>
                      <p className="text-[11px] text-muted-500">Swap pre-loved clothes with campus peers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Browse by Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mt-1 font-editorial">
              Explore Campus Essentials
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${cat.query}`}
              className="card-premium p-4 flex flex-col items-center text-center hover:border-forest-800 hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 group-hover:bg-forest-800 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                <cat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-dark-900">{cat.name}</h3>
              <p className="text-[11px] text-muted-500 mt-0.5 line-clamp-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Connected to MongoDB Express API) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Fresh Drops
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mt-1 font-editorial">
              Featured Campus Listings
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1.5"
          >
            <span>Explore All ({featuredListings.length > 0 ? `${featuredListings.length}+` : 'Browse'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid
          listings={featuredListings}
          loading={loading}
          skeletonCount={8}
          emptyTitle="No featured items available right now"
          emptyDescription="Be the first student to publish an item today!"
        />
      </section>


      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-forest-800 text-white p-8 sm:p-14 text-center overflow-hidden shadow-card">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-white">
              Ready to Give Your Clothes a Second Life?
            </h2>
            <p className="text-sm sm:text-base text-forest-100 leading-relaxed">
              Join students across campus today. Declutter your closet, find unique thrift gems, and trade sustainably.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link to="/register" className="btn-secondary text-base px-6 py-3">
                Create Free Student Account
              </Link>
              <Link
                to="/marketplace"
                className="btn-outline bg-transparent text-white border-white/40 hover:bg-white/10 hover:border-white text-base px-6 py-3"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
