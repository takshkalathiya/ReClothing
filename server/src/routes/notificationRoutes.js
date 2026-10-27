const express = require('express');
const {
  getMyNotifications,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.patch('/mark-read', markAllAsRead);

module.exports = router;
