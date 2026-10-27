const express = require('express');
const { body } = require('express-validator');
const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const createRequestValidation = [
  body('listingId').notEmpty().withMessage('Listing ID is required'),
  body('type')
    .notEmpty()
    .withMessage('Request type is required')
    .isIn(['purchase', 'exchange'])
    .withMessage('Type must be either purchase or exchange'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
];

router.use(protect); // All request routes require authentication

router.post('/', createRequestValidation, validateRequest, createRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.patch('/:id/accept', acceptRequest);
router.patch('/:id/reject', rejectRequest);
router.patch('/:id/cancel', cancelRequest);

module.exports = router;
