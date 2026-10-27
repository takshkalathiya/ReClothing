const Listing = require('../models/Listing');
const Request = require('../models/Request');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard metrics & aggregation stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Global / Platform Overview
  const totalListings = await Listing.countDocuments();
  const activeListings = await Listing.countDocuments({ status: 'active' });
  const completedListings = await Listing.countDocuments({
    status: { $in: ['reserved', 'sold', 'exchanged'] },
  });

  const totalRequests = await Request.countDocuments();
  const pendingRequests = await Request.countDocuments({ status: 'pending' });
  const acceptedRequests = await Request.countDocuments({ status: 'accepted' });
  const totalUsers = await User.countDocuments();

  // User-specific quick stats
  const myListingsCount = await Listing.countDocuments({ seller: userId });
  const mySentRequestsCount = await Request.countDocuments({ buyer: userId });
  const myReceivedRequestsCount = await Request.countDocuments({ seller: userId });
  const myPendingReceivedCount = await Request.countDocuments({ seller: userId, status: 'pending' });

  // Category distribution aggregation
  const categoryStats = await Listing.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Request status distribution aggregation
  const requestStats = await Request.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Listing type distribution
  const listingTypeStats = await Listing.aggregate([
    { $group: { _id: '$listingType', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics calculated',
    data: {
      overview: {
        totalListings,
        activeListings,
        completedListings,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        totalUsers,
      },
      userStats: {
        myListingsCount,
        mySentRequestsCount,
        myReceivedRequestsCount,
        myPendingReceivedCount,
      },
      categoryStats: categoryStats.map((item) => ({
        category: item._id,
        count: item.count,
      })),
      requestStats: requestStats.map((item) => ({
        status: item._id,
        count: item.count,
      })),
      listingTypeStats: listingTypeStats.map((item) => ({
        type: item._id,
        count: item.count,
      })),
    },
  });
});

// @desc    Get recent platform activity & recent listings
// @route   GET /api/dashboard/activity
// @access  Private
const getDashboardActivity = asyncHandler(async (req, res) => {
  const recentListings = await Listing.find()
    .populate('seller', 'name college avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentRequests = await Request.find({
    $or: [{ seller: req.user._id }, { buyer: req.user._id }],
  })
    .populate('listing', 'title images price')
    .populate('buyer', 'name college avatar')
    .populate('seller', 'name college avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    message: 'Dashboard recent activity fetched',
    data: {
      recentListings,
      recentRequests,
    },
  });
});

// @desc    Get all listings for admin moderation
// @route   GET /api/dashboard/listings
// @access  Private/Admin
const getAdminListings = asyncHandler(async (req, res) => {
  const { status, category, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status && status !== 'All') query.status = status;
  if (category && category !== 'All') query.category = category;
  if (search && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('seller', 'name email college avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    message: 'Admin listings fetched',
    data: { listings, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
  });
});

// @desc    Update listing status as admin
// @route   PATCH /api/dashboard/listings/:id/status
// @access  Private/Admin
const updateListingStatusByAdmin = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'reserved', 'exchanged', 'sold', 'inactive'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status provided.' });
  }

  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('seller', 'name email college');

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  res.status(200).json({
    success: true,
    message: `Listing status changed to ${status}.`,
    data: listing,
  });
});

// @desc    Delete any listing as admin
// @route   DELETE /api/dashboard/listings/:id
// @access  Private/Admin
const deleteListingByAdmin = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  await Listing.findByIdAndDelete(req.params.id);
  await Request.deleteMany({ listing: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Listing removed by administrator.',
    data: { id: req.params.id },
  });
});

// @desc    Get all users for admin directory
// @route   GET /api/dashboard/users
// @access  Private/Admin
const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  const usersWithCounts = await Promise.all(
    users.map(async (u) => {
      const listingCount = await Listing.countDocuments({ seller: u._id });
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        college: u.college,
        role: u.role,
        avatar: u.avatar,
        listingCount,
        createdAt: u.createdAt,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: 'Admin users fetched',
    data: usersWithCounts,
  });
});

// @desc    Export platform inventory and telemetry to CSV
// @route   GET /api/dashboard/export
// @access  Private/Admin
const exportPlatformData = asyncHandler(async (req, res) => {
  const listings = await Listing.find().populate('seller', 'name email college').sort({ createdAt: -1 });

  const csvHeaders = 'ID,Title,Category,Price,Condition,ListingType,Status,Views,SellerName,SellerEmail,College,CreatedAt\n';
  const csvRows = listings.map((l) => {
    const cleanTitle = `"${(l.title || '').replace(/"/g, '""')}"`;
    const cleanSeller = `"${(l.seller?.name || 'Unknown').replace(/"/g, '""')}"`;
    const cleanCollege = `"${(l.seller?.college || '').replace(/"/g, '""')}"`;
    return `${l._id},${cleanTitle},${l.category},${l.price},${l.condition},${l.listingType},${l.status},${l.viewsCount || 0},${cleanSeller},${l.seller?.email || ''},${cleanCollege},${new Date(l.createdAt).toISOString()}`;
  }).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ReWear_Platform_Audit.csv"');
  res.status(200).send(csvHeaders + csvRows);
});

module.exports = {
  getDashboardStats,
  getDashboardActivity,
  getAdminListings,
  updateListingStatusByAdmin,
  deleteListingByAdmin,
  getAdminUsers,
  exportPlatformData,
};
