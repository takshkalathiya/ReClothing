const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate('sender', 'name avatar');

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    message: 'Notifications fetched.',
    data: {
      notifications,
      unreadCount,
    },
  });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read.',
    data: {},
  });
});

module.exports = {
  getMyNotifications,
  markAllAsRead,
};
