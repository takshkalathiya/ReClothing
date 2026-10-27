const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Send a message to another campus student
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, listingId, text } = req.body;

  if (!recipientId || !text || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Recipient and message text are required.',
    });
  }

  if (recipientId.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot message yourself.',
    });
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({
      success: false,
      message: 'Recipient student not found.',
    });
  }

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    listing: listingId || undefined,
    text: text.trim(),
  });

  // Create notification for recipient
  try {
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      title: `New message from ${req.user.name}`,
      message: text.trim().substring(0, 80),
      link: `/messages?user=${req.user._id}`,
      type: 'message',
    });
  } catch (err) {
    console.error('Failed to create message notification:', err.message);
  }

  const populated = await Message.findById(message._id)
    .populate('sender', 'name avatar college')
    .populate('recipient', 'name avatar college')
    .populate('listing', 'title price images');

  res.status(201).json({
    success: true,
    message: 'Message sent successfully.',
    data: populated,
  });
});

// @desc    Get all conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all messages involving this user
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar college')
    .populate('recipient', 'name avatar college')
    .populate('listing', 'title price images');

  // Group by conversation partner
  const conversationsMap = new Map();

  for (const msg of messages) {
    const isSender = msg.sender._id.toString() === userId.toString();
    const partner = isSender ? msg.recipient : msg.sender;
    const partnerId = partner._id.toString();

    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, {
        partner,
        lastMessage: msg,
        listing: msg.listing,
        unreadCount: !isSender && !msg.read ? 1 : 0,
      });
    } else if (!isSender && !msg.read) {
      const conv = conversationsMap.get(partnerId);
      conv.unreadCount += 1;
    }
  }

  const conversations = Array.from(conversationsMap.values());

  res.status(200).json({
    success: true,
    message: 'Conversations retrieved.',
    data: conversations,
  });
});

// @desc    Get message thread with a specific student
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessagesWithUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { otherUserId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar college')
    .populate('recipient', 'name avatar college')
    .populate('listing', 'title price images');

  // Mark incoming messages as read
  await Message.updateMany(
    { sender: otherUserId, recipient: userId, read: false },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'Message thread fetched.',
    data: messages,
  });
});

module.exports = {
  sendMessage,
  getConversations,
  getMessagesWithUser,
};
