const Listing = require('../models/Listing');
const Request = require('../models/Request');
const asyncHandler = require('../utils/asyncHandler');

// Escape helper for safe regex searches
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// @desc    Get all listings with filtering, search, sorting & pagination
// @route   GET /api/listings
// @access  Public
const getListings = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    condition,
    listingType,
    size,
    minPrice,
    maxPrice,
    status = 'active',
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  // Status filter (default to active for public exploration)
  if (status && status !== 'all') {
    query.status = status;
  }

  // Text/Keyword search on title & description
  if (keyword && keyword.trim() !== '') {
    const safeKeyword = escapeRegex(keyword.trim());
    query.$or = [
      { title: { $regex: safeKeyword, $options: 'i' } },
      { description: { $regex: safeKeyword, $options: 'i' } },
    ];
  }

  // Category filter
  if (category && category !== 'All') {
    query.category = category;
  }

  // Condition filter
  if (condition && condition !== 'All') {
    query.condition = condition;
  }

  // Listing Type filter
  if (listingType && listingType !== 'All') {
    query.listingType = listingType;
  }

  // Size filter
  if (size && size !== 'All') {
    query.size = { $regex: new RegExp(`^${escapeRegex(size)}$`, 'i') };
  }

  // Price range filters
  if (minPrice !== undefined && minPrice !== '' || maxPrice !== undefined && maxPrice !== '') {
    query.price = {};
    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (!isNaN(min)) query.price.$gte = min;
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max)) query.price.$lte = max;
    }
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') {
    sortOption = { price: 1, createdAt: -1 };
  } else if (sort === 'price-desc') {
    sortOption = { price: -1, createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  // Pagination setup
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('seller', 'name college avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    message: 'Listings fetched successfully',
    data: {
      listings,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    },
  });
});

// @desc    Get featured listings for landing page
// @route   GET /api/listings/featured
// @access  Public
const getFeaturedListings = asyncHandler(async (req, res) => {
  const featured = await Listing.find({ status: 'active' })
    .populate('seller', 'name college avatar')
    .sort({ createdAt: -1 })
    .limit(8);

  res.status(200).json({
    success: true,
    message: 'Featured listings fetched successfully',
    data: featured,
  });
});

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).populate('seller', 'name email college avatar createdAt');

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Listing details retrieved',
    data: listing,
  });
});

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    size,
    condition,
    listingType,
    images,
    exchangePreference,
  } = req.body;

  // Validate images
  const imageList = Array.isArray(images)
    ? images.map((img) => img.trim()).filter(Boolean)
    : typeof images === 'string' && images.trim()
    ? [images.trim()]
    : [];

  if (imageList.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one valid image URL is required.',
    });
  }

  const numericPrice = listingType === 'For Exchange' ? Number(price || 0) : Number(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a valid non-negative number.',
    });
  }

  const listing = await Listing.create({
    title: title.trim(),
    description: description.trim(),
    category,
    price: numericPrice,
    size: size ? size.trim() : 'N/A',
    condition,
    listingType,
    images: imageList,
    exchangePreference: exchangePreference ? exchangePreference.trim() : '',
    seller: req.user._id, // Enforce authenticated owner
    status: 'active',
  });

  const populatedListing = await Listing.findById(listing._id).populate(
    'seller',
    'name college avatar'
  );

  res.status(201).json({
    success: true,
    message: 'Listing created successfully!',
    data: populatedListing,
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner only)
const updateListing = asyncHandler(async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  // Ensure caller is the owner
  if (listing.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: You can only edit your own listings.',
    });
  }

  const {
    title,
    description,
    category,
    price,
    size,
    condition,
    listingType,
    images,
    exchangePreference,
    status,
  } = req.body;

  if (title) listing.title = title.trim();
  if (description) listing.description = description.trim();
  if (category) listing.category = category;
  if (price !== undefined) {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number.',
      });
    }
    listing.price = numPrice;
  }
  if (size !== undefined) listing.size = size.trim();
  if (condition) listing.condition = condition;
  if (listingType) listing.listingType = listingType;
  if (exchangePreference !== undefined) listing.exchangePreference = exchangePreference.trim();
  if (status) listing.status = status;

  if (images) {
    const imageList = Array.isArray(images)
      ? images.map((img) => img.trim()).filter(Boolean)
      : typeof images === 'string' && images.trim()
      ? [images.trim()]
      : [];
    if (imageList.length > 0) {
      listing.images = imageList;
    }
  }

  const updatedListing = await listing.save();
  const populated = await Listing.findById(updatedListing._id).populate(
    'seller',
    'name college avatar'
  );

  res.status(200).json({
    success: true,
    message: 'Listing updated successfully.',
    data: populated,
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner only)
const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  // Verify ownership
  if (listing.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: You can only delete your own listings.',
    });
  }

  await Listing.deleteOne({ _id: listing._id });
  // Also clean up any pending requests associated with this deleted listing
  await Request.deleteMany({ listing: listing._id });

  res.status(200).json({
    success: true,
    message: 'Listing removed successfully.',
    data: {},
  });
});

// @desc    Get all listings belonging to authenticated user
// @route   GET /api/listings/mine
// @access  Private
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'User listings retrieved.',
    data: listings,
  });
});

// @desc    Post a community question on a listing
// @route   POST /api/listings/:id/questions
// @access  Private
const addListingQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a valid question.' });
  }

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  listing.questions.push({
    user: req.user._id,
    userName: req.user.name || 'Campus Student',
    question: question.trim(),
    createdAt: new Date(),
  });

  await listing.save();

  res.status(201).json({
    success: true,
    message: 'Question posted successfully.',
    data: listing.questions,
  });
});

// @desc    Answer a community question on a listing (seller only)
// @route   PATCH /api/listings/:id/questions/:questionId
// @access  Private
const answerListingQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer || !answer.trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a valid answer.' });
  }

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }

  const isSeller = listing.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin' || req.user.email === 'sanskarbhanderi08@gmail.com';
  if (!isSeller && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Only the seller can answer this question.' });
  }

  const q = listing.questions.id(req.params.questionId);
  if (!q) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }

  q.answer = answer.trim();
  await listing.save();

  res.status(200).json({
    success: true,
    message: 'Answer posted successfully.',
    data: listing.questions,
  });
});

module.exports = {
  getListings,
  getFeaturedListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  addListingQuestion,
  answerListingQuestion,
};
