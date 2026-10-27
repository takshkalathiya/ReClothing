const User = require('../models/User');
const Listing = require('../models/Listing');
const Request = require('../models/Request');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user profile with aggregated statistics
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  const totalListings = await Listing.countDocuments({ seller: req.user._id });
  const activeListings = await Listing.countDocuments({ seller: req.user._id, status: 'active' });
  const soldExchangedListings = await Listing.countDocuments({
    seller: req.user._id,
    status: { $in: ['reserved', 'sold', 'exchanged'] },
  });

  const totalRequestsReceived = await Request.countDocuments({ seller: req.user._id });
  const totalRequestsSent = await Request.countDocuments({ buyer: req.user._id });
  const acceptedRequests = await Request.countDocuments({
    $or: [{ seller: req.user._id }, { buyer: req.user._id }],
    status: 'accepted',
  });

  res.status(200).json({
    success: true,
    message: 'Profile data retrieved',
    data: {
      user,
      stats: {
        totalListings,
        activeListings,
        soldExchangedListings,
        totalRequestsReceived,
        totalRequestsSent,
        acceptedRequests,
      },
    },
  });
});

// @desc    Update user profile fields
// @route   PATCH /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  const { name, college, avatar } = req.body;

  if (name && name.trim()) user.name = name.trim();
  if (college && college.trim()) user.college = college.trim();
  if (avatar !== undefined) user.avatar = avatar.trim();

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: updatedUser,
  });
});

// @desc    Get current user's wishlist
// @route   GET /api/users/me/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'seller', select: 'name college avatar' },
  });

  res.status(200).json({
    success: true,
    message: 'Wishlist retrieved',
    data: user.wishlist || [],
  });
});

// @desc    Add listing to wishlist
// @route   POST /api/users/me/wishlist/:listingId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  const user = await User.findById(req.user._id);
  const alreadyInWishlist = user.wishlist.some(
    (id) => id.toString() === listingId.toString()
  );

  if (!alreadyInWishlist) {
    user.wishlist.push(listingId);
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Item added to your wishlist.',
    data: user.wishlist,
  });
});

// @desc    Remove listing from wishlist
// @route   DELETE /api/users/me/wishlist/:listingId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== listingId.toString());
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from your wishlist.',
    data: user.wishlist,
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
