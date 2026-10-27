const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getUserProfile);
router.patch('/me', updateUserProfile);
router.get('/me/wishlist', getWishlist);
router.post('/me/wishlist/:listingId', addToWishlist);
router.delete('/me/wishlist/:listingId', removeFromWishlist);

module.exports = router;
