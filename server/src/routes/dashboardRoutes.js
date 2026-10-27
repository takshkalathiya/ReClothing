const express = require('express');
const {
  getDashboardStats,
  getDashboardActivity,
  getAdminListings,
  updateListingStatusByAdmin,
  deleteListingByAdmin,
  getAdminUsers,
  exportPlatformData,
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Strict security: Both authenticated AND administrator privileges required
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/activity', getDashboardActivity);
router.get('/listings', getAdminListings);
router.patch('/listings/:id/status', updateListingStatusByAdmin);
router.delete('/listings/:id', deleteListingByAdmin);
router.get('/users', getAdminUsers);
router.get('/export', exportPlatformData);

module.exports = router;
