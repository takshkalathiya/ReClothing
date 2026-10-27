const express = require('express');
const {
  sendMessage,
  getConversations,
  getMessagesWithUser,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:otherUserId', getMessagesWithUser);

module.exports = router;
