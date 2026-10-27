const Request = require('../models/Request');
const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit a purchase or exchange request
// @route   POST /api/requests
// @access  Private
const createRequest = asyncHandler(async (req, res) => {
  const {
    listingId,
    type,
    message,
    meetupLocation,
    preferredTime,
    exchangeItemOffered,
  } = req.body;

  if (!listingId || !type) {
    return res.status(400).json({
      success: false,
      message: 'Listing ID and request type are required.',
    });
  }

  if (!['purchase', 'exchange'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Request type must be either "purchase" or "exchange".',
    });
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  // Prevent requesting own listing
  if (listing.seller.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot submit a request for your own listing.',
    });
  }

  // Verify listing availability
  if (listing.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: `This item is currently ${listing.status} and cannot accept new requests.`,
    });
  }

  // Check if buyer already has an active pending request for this listing
  const existingPending = await Request.findOne({
    listing: listingId,
    buyer: req.user._id,
    status: 'pending',
  });

  if (existingPending) {
    return res.status(400).json({
      success: false,
      message: 'You already have a pending request for this item. Please wait for the seller response.',
    });
  }

  const newRequest = await Request.create({
    listing: listingId,
    buyer: req.user._id,
    seller: listing.seller,
    type,
    message: message ? message.trim() : '',
    meetupLocation: meetupLocation ? meetupLocation.trim() : 'Campus Library Front Entrance',
    preferredTime: preferredTime ? preferredTime.trim() : 'Flexible',
    exchangeItemOffered: exchangeItemOffered ? exchangeItemOffered.trim() : '',
    status: 'pending',
  });

  const populatedRequest = await Request.findById(newRequest._id)
    .populate('listing', 'title price images category condition status')
    .populate('seller', 'name email college avatar');

  res.status(201).json({
    success: true,
    message: 'Your request has been sent to the seller successfully!',
    data: populatedRequest,
  });
});

// @desc    Get requests sent by authenticated user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ buyer: req.user._id })
    .populate('listing', 'title price images category condition status')
    .populate('seller', 'name email college avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Sent requests retrieved.',
    data: requests,
  });
});

// @desc    Get requests received by authenticated user (as seller)
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ seller: req.user._id })
    .populate('listing', 'title price images category condition status')
    .populate('buyer', 'name email college avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Received requests retrieved.',
    data: requests,
  });
});

// @desc    Accept request (Seller only)
// @route   PATCH /api/requests/:id/accept
// @access  Private (Seller only)
const acceptRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found.',
    });
  }

  // Authorization check: Only the seller can accept
  if (request.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Only the seller of this item can accept requests.',
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot accept this request. Its current status is "${request.status}".`,
    });
  }

  // Atomically check listing and ensure it is still active
  const listing = await Listing.findById(request.listing);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'The associated listing no longer exists.',
    });
  }

  if (listing.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: `Item cannot be accepted because it is already marked as ${listing.status}.`,
    });
  }

  // Mark request accepted
  request.status = 'accepted';
  await request.save();

  // Update listing availability: reserved for purchase, exchanged for exchange
  const newStatus = request.type === 'purchase' ? 'reserved' : 'exchanged';
  listing.status = newStatus;
  await listing.save();

  // Automatically decline other pending requests for this same listing
  await Request.updateMany(
    {
      listing: listing._id,
      _id: { $ne: request._id },
      status: 'pending',
    },
    { $set: { status: 'rejected' } }
  );

  const populated = await Request.findById(request._id)
    .populate('listing', 'title price images category condition status')
    .populate('buyer', 'name email college avatar');

  res.status(200).json({
    success: true,
    message: `Request accepted! The listing is now marked as ${newStatus}.`,
    data: populated,
  });
});

// @desc    Reject request (Seller only)
// @route   PATCH /api/requests/:id/reject
// @access  Private (Seller only)
const rejectRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found.',
    });
  }

  // Authorization check
  if (request.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Only the seller of this item can reject requests.',
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot reject this request. Its status is "${request.status}".`,
    });
  }

  request.status = 'rejected';
  await request.save();

  const populated = await Request.findById(request._id)
    .populate('listing', 'title price images category condition status')
    .populate('buyer', 'name email college avatar');

  res.status(200).json({
    success: true,
    message: 'Request rejected.',
    data: populated,
  });
});

// @desc    Cancel request (Buyer only)
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Buyer only)
const cancelRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found.',
    });
  }

  // Authorization check: Only the buyer can cancel
  if (request.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: You can only cancel your own requests.',
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel a request that is already ${request.status}.`,
    });
  }

  request.status = 'cancelled';
  await request.save();

  res.status(200).json({
    success: true,
    message: 'Request cancelled successfully.',
    data: request,
  });
});

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
