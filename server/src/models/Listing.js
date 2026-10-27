const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      trim: true,
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Books', 'Other'],
        message: '{VALUE} is not a supported category',
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    size: {
      type: String,
      trim: true,
      default: 'N/A',
      maxlength: [20, 'Size string cannot exceed 20 characters'],
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: {
        values: ['New', 'Like New', 'Good', 'Fair'],
        message: '{VALUE} is not a valid condition',
      },
    },
    listingType: {
      type: String,
      required: [true, 'Please select listing type (For Sale or For Exchange)'],
      enum: {
        values: ['For Sale', 'For Exchange'],
        message: '{VALUE} is not a valid listing type',
      },
      default: 'For Sale',
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one image URL must be provided',
      },
    },
    exchangePreference: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Exchange preference cannot exceed 300 characters'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must belong to a seller'],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'reserved', 'exchanged', 'sold', 'inactive'],
      default: 'active',
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    questions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: {
          type: String,
          default: 'Campus Student',
        },
        question: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },
        answer: {
          type: String,
          default: '',
          trim: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying, filtering, and text search
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ listingType: 1, status: 1 });
listingSchema.index({ condition: 1, status: 1 });
listingSchema.index({ price: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
