const express = require('express');
const { body } = require('express-validator');
const {
  getListings,
  getFeaturedListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  addListingQuestion,
  answerListingQuestion,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const createListingValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1500 })
    .withMessage('Description cannot exceed 1500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Clothing', 'Shoes', 'Accessories', 'Bags', 'Books', 'Other'])
    .withMessage('Invalid category selected'),
  body('condition')
    .notEmpty()
    .withMessage('Condition is required')
    .isIn(['New', 'Like New', 'Good', 'Fair'])
    .withMessage('Invalid condition selected'),
  body('listingType')
    .notEmpty()
    .withMessage('Listing type is required')
    .isIn(['For Sale', 'For Exchange'])
    .withMessage('Invalid listing type'),
];

router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/mine', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, createListingValidation, validateRequest, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

// Community Questions & Answers
router.post('/:id/questions', protect, addListingQuestion);
router.patch('/:id/questions/:questionId', protect, answerListingQuestion);

module.exports = router;
