const express = require('express');
const {
  createReview,
  getSellerReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);

module.exports = router;
