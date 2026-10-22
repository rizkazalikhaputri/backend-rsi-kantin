const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { idParams } = require('../validations/commonSchema');

router.get('/', authenticate, authorize('admin'), reviewController.getReviews);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate({ params: idParams }),
  reviewController.deleteReview
);

module.exports = router;