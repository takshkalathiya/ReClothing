import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Trash2,
  Download,
  Filter,
  Search,
  AlertCircle,
  Eye,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardApi } from '../api/userApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, timeAgo } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#346B54', '#2B5B47', '#E11D48', '#D97706', '#64748B'];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'moderation' | 'users' | 'sustainability'
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Moderation tab states
  const [adminListings, setAdminListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [moderationSearch, setModerationSearch] = useState('');
  const [moderationStatus, setModerationStatus] = useState('All');

  // Users tab states
  const [adminUsers, setAdminUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Action loading IDs
  const [actionId, setActionId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getActivity(),
      ]);

      if (statsRes && statsRes.data) setStats(statsRes.data);
      if (activityRes && activityRes.data) setActivity(activityRes.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminListings = async () => {
    try {
      setListingsLoading(true);
      const res = await dashboardApi.getAdminListings({
        search: moderationSearch,
        status: moderationStatus !== 'All' ? moderationStatus : undefined,
      });
      if (res && res.data) {
        setAdminListings(res.data.listings || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load listings for moderation.');
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await dashboardApi.getAdminUsers();
      if (res && res.data) {
        setAdminUsers(res.data || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to retrieve user directory.');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'moderation') {
      fetchAdminListings();
    } else if (activeTab === 'users') {
      fetchAdminUsers();
    }
  }, [activeTab, moderationStatus]);

  // Handler for admin listing status toggle
  const handleStatusChange = async (listingId, newStatus) => {
    setActionId(listingId);
    try {
      await dashboardApi.updateListingStatus(listingId, newStatus);
      toast.success(`Listing status updated to "${newStatus}"`);
      await fetchAdminListings();
    } catch (err) {
      toast.error(err.message || 'Could not update listing status.');
    } finally {
      setActionId(null);
    }
  };

  // Handler for admin listing deletion
  const handleDeleteListing = async (listingId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setActionId(listingId);
    try {
      await dashboardApi.deleteListing(listingId);
      toast.success(`Listing "${title}" removed successfully.`);
      await fetchAdminListings();
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete listing.');
    } finally {
      setActionId(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    window.open(dashboardApi.exportUrl(), '_blank');
    toast.success('Downloading platform inventory audit report (CSV)...');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Computing live marketplace metrics..." />
      </div>
    );
  }

  const overview = stats?.overview || {};
  const categoryStats = stats?.categoryStats || [];
  const requestStats = stats?.requestStats || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-forest-700" />
              <span>MongoDB Live Telemetry</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Platform Administrator: {user?.name || 'Sanskar Bhanderi'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 font-editorial">
            Admin Analytics & Management Control
          </h1>
          <p className="text-xs sm:text-sm text-muted-600 mt-1">
            Restricted Admin access • Real-time platform telemetry across circular trades, listings, and college activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="Download CSV report of platform data"
          >
            <Download className="w-3.5 h-3.5 text-forest-700" />
            <span>Export CSV</span>
          </button>
          <Link to="/sell" className="btn-primary text-xs py-2 px-4">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Item</span>
          </Link>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'telemetry'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-dark-800 hover:bg-ivory-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Telemetry & Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'moderation'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-dark-800 hover:bg-ivory-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Listings Moderation</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-forest-800 text-white">
            {overview.totalListings || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-dark-800 hover:bg-ivory-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Campus Directory</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-forest-800 text-white">
            {overview.totalUsers || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'export'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-dark-800 hover:bg-ivory-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Audit & CSV Export</span>
        </button>
      </div>

      {/* TAB 1: TELEMETRY & OVERVIEW */}
      {activeTab === 'telemetry' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Listings */}
            <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
                  Total Listings
                </span>
                <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-dark-900 font-editorial">
                {overview.totalListings || 0}
              </p>
              <p className="text-xs text-muted-600 mt-1">
                <strong className="text-forest-800 font-semibold">{overview.activeListings || 0}</strong> active on campus
              </p>
            </div>

            {/* Total Trade Requests */}
            <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
                  Trade Inquiries
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-dark-900 font-editorial">
                {overview.totalRequests || 0}
              </p>
              <p className="text-xs text-muted-600 mt-1">
                <strong className="text-amber-800 font-semibold">{overview.pendingRequests || 0}</strong> awaiting seller
              </p>
            </div>

            {/* Completed Swaps */}
            <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
                  Successful Trades
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-dark-900 font-editorial">
                {overview.acceptedRequests || 0}
              </p>
              <p className="text-xs text-muted-600 mt-1">
                Garments saved from landfills
              </p>
            </div>

            {/* Registered Students */}
            <div className="bg-white border border-border p-5 rounded-2xl shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-500">
                  Campus Members
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-dark-900 font-editorial">
                {overview.totalUsers || 0}
              </p>
              <p className="text-xs text-muted-600 mt-1">
                Verified university accounts
              </p>
            </div>
          </div>

          {/* Visual Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Category Breakdown Bar Chart */}
            <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-6 shadow-subtle">
              <div className="mb-4">
                <h3 className="text-base font-bold text-dark-900 font-editorial">
                  Listings Distribution by Category
                </h3>
                <p className="text-xs text-muted-500">
                  Aggregated in real-time from active MongoDB listings
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fill: '#777D75' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#777D75' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#20251F',
                        color: '#FFF',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#234D3C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Request Status Breakdown Pie Chart */}
            <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-6 shadow-subtle flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="text-base font-bold text-dark-900 font-editorial">
                  Inquiry Status Breakdown
                </h3>
                <p className="text-xs text-muted-500">
                  Status of all peer purchase & swap proposals
                </p>
              </div>

              <div className="h-56 w-full">
                {requestStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestStats}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {requestStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#20251F',
                          color: '#FFF',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(val) => (
                          <span className="text-xs font-medium text-dark-800 capitalize">
                            {val}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-muted-500">
                    No request statistics yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Listings */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="text-base font-bold text-dark-900 font-editorial">
                  Recent Campus Listings
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('moderation')}
                  className="text-xs font-semibold text-forest-800 hover:text-forest-900"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {activity?.recentListings?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-ivory-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/60'}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/listings/${item._id}`}
                          className="text-xs font-bold text-dark-900 hover:text-forest-800 truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-muted-500">
                          by {item.seller?.name} • {timeAgo(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-forest-900">
                        {formatCurrency(item.price, item.listingType)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trade Activity */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="text-base font-bold text-dark-900 font-editorial">
                  Live Platform Inquiries
                </h3>
                <Link to="/my-requests" className="text-xs font-semibold text-forest-800 hover:text-forest-900">
                  View Requests →
                </Link>
              </div>

              <div className="space-y-3">
                {activity?.recentRequests?.length > 0 ? (
                  activity.recentRequests.map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-ivory-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-dark-900 truncate">
                          {req.listing?.title || 'Listing Item'}
                        </p>
                        <p className="text-[11px] text-muted-500 mt-0.5">
                          {req.buyer?.name} ➔ {req.seller?.name} • {timeAgo(req.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`badge text-[10px] font-semibold uppercase ${
                          req.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-500 text-center py-8">
                    No recent inquiry activity found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-border">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={moderationSearch}
                onChange={(e) => setModerationSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAdminListings()}
                placeholder="Search listings by title or description..."
                className="input-field pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={moderationStatus}
                onChange={(e) => setModerationStatus(e.target.value)}
                className="input-field text-xs py-2 w-36"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="exchanged">Exchanged</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchAdminListings}
                className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Moderation Table */}
          <div className="bg-white rounded-3xl border border-border shadow-subtle overflow-hidden">
            {listingsLoading ? (
              <div className="py-16 flex items-center justify-center">
                <LoadingSpinner size="md" text="Loading platform listings..." />
              </div>
            ) : adminListings.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-500">
                No listings matched your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-ivory-100 border-b border-border text-dark-900 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / Type</th>
                      <th className="py-3 px-4">Seller</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Status & Control</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {adminListings.map((l) => (
                      <tr key={l._id} className="hover:bg-ivory-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={l.images?.[0] || 'https://via.placeholder.com/50'}
                              alt={l.title}
                              className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <Link
                                to={`/listings/${l._id}`}
                                className="font-bold text-dark-900 hover:text-forest-800 truncate block"
                              >
                                {l.title}
                              </Link>
                              <span className="text-[10px] text-muted-500">
                                {formatDate(l.createdAt)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-dark-800">
                          {l.category}
                        </td>
                        <td className="py-3 px-4 font-bold text-forest-900">
                          {formatCurrency(l.price, l.listingType)}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-dark-900">{l.seller?.name || 'Unknown'}</p>
                          <p className="text-[10px] text-muted-500">{l.seller?.college}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-muted-600">
                          {l.viewsCount || 0}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={l.status}
                            disabled={actionId === l._id}
                            onChange={(e) => handleStatusChange(l._id, e.target.value)}
                            className="bg-ivory-100 border border-border rounded-lg text-xs py-1 px-2 font-semibold text-dark-900 cursor-pointer"
                          >
                            <option value="active">Active</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                            <option value="exchanged">Exchanged</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteListing(l._id, l.title)}
                            disabled={actionId === l._id}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete this listing as Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CAMPUS USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-border shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-dark-900 font-editorial">
                  Registered University Students & Admins
                </h3>
                <p className="text-xs text-muted-500">
                  Total student accounts registered across colleges
                </p>
              </div>
              <span className="badge bg-forest-100 text-forest-900 font-bold text-xs">
                {adminUsers.length} Members
              </span>
            </div>

            {usersLoading ? (
              <div className="py-16 flex items-center justify-center">
                <LoadingSpinner size="md" text="Loading campus user directory..." />
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-500">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-ivory-100 border-b border-border text-dark-900 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">College</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Items Posted</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {adminUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-ivory-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center">
                                {u.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-dark-900">{u.name}</p>
                              <p className="text-[10px] text-muted-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-dark-800">
                          {u.college || 'College Campus'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`badge text-[10px] uppercase font-bold ${
                              u.role === 'admin'
                                ? 'bg-forest-800 text-white'
                                : 'bg-gray-100 text-dark-800'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-forest-900">
                          {u.listingCount || 0} listings
                        </td>
                        <td className="py-3 px-4 text-muted-500">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT & CSV EXPORT */}
      {activeTab === 'export' && (
        <div className="space-y-8 animate-fade-in">
          {/* Audit Export Box */}
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-forest-800" />
                <span>Academic Evaluation & Audit</span>
              </div>
              <h3 className="text-xl font-bold text-dark-900 font-editorial">
                Export Complete Platform Inventory (CSV)
              </h3>
              <p className="text-xs sm:text-sm text-muted-600">
                Generate an end-term submission data dump with all items, seller contacts, prices, status, views, and timestamp telemetry.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-primary text-xs py-3 px-6 shrink-0 flex items-center gap-2 font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Audit File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
