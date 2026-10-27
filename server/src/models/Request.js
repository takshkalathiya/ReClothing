const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Request must reference a listing'],
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must have a buyer'],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must have a seller'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Request type is required'],
      enum: {
        values: ['purchase', 'exchange'],
        message: '{VALUE} is not a valid request type',
      },
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    meetupLocation: {
      type: String,
      trim: true,
      default: 'Campus Library Front Entrance',
    },
    preferredTime: {
      type: String,
      trim: true,
      default: 'Flexible',
    },
    exchangeItemOffered: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Exchange item description cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help lookup pending requests by buyer for a specific listing
requestSchema.index({ listing: 1, buyer: 1, status: 1 });
requestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Request', requestSchema);
