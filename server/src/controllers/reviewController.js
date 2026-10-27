const Review = require('../models/Review');
const Request = require('../models/Request');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit a seller review / feedback after a trade
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { sellerId, listingId, rating, comment, tags } = req.body;

  if (!sellerId || !listingId || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Seller, listing ID, and rating (1-5) are required.',
    });
  }

  if (sellerId.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot write a review for yourself.',
    });
  }

  // Check if review already exists
  const existing = await Review.findOne({
    seller: sellerId,
    buyer: req.user._id,
    listing: listingId,
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted a review for this transaction.',
    });
  }

  const review = await Review.create({
    seller: sellerId,
    buyer: req.user._id,
    listing: listingId,
    rating: Number(rating),
    comment: comment ? comment.trim() : '',
    tags: Array.isArray(tags) ? tags : [],
  });

  // Notify seller of positive feedback
  try {
    await Notification.create({
      recipient: sellerId,
      sender: req.user._id,
      title: `New ${rating}-star review from ${req.user.name}`,
      message: comment ? `"${comment.substring(0, 60)}..."` : 'Received new campus trade rating!',
      link: '/profile',
      type: 'review',
    });
  } catch (err) {
    console.error('Failed to notify seller of review:', err.message);
  }

  const populated = await Review.findById(review._id)
    .populate('buyer', 'name avatar college')
    .populate('listing', 'title');

  res.status(201).json({
    success: true,
    message: 'Thank you for rating your campus peer!',
    data: populated,
  });
});

// @desc    Get all reviews for a seller with aggregate score
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getSellerReviews = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const reviews = await Review.find({ seller: sellerId })
    .populate('buyer', 'name avatar college')
    .populate('listing', 'title')
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : 5.0;

  res.status(200).json({
    success: true,
    message: 'Seller reviews fetched.',
    data: {
      reviews,
      totalReviews,
      averageRating: Number(averageRating),
    },
  });
});

module.exports = {
  createReview,
  getSellerReviews,
};
