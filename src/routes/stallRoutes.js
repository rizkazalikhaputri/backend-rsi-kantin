const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');
const reviewController = require('../controllers/reviewController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { idParams } = require('../validations/commonSchema');
const {
  listQuery,
  createStallBody,
  updateStallBody,
  reviewBody,
} = require('../validations/stallSchema');

// Publik
router.get('/', validate({ query: listQuery }), stallController.getStalls);
router.get('/:id', validate({ params: idParams }), stallController.getStallById);

// owner, admin
router.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate({ body: createStallBody }),
  stallController.createStall
);

// owner (hanya miliknya, dicek di controller), admin
router.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate({ params: idParams, body: updateStallBody }),
  stallController.updateStall
);

// admin saja
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate({ params: idParams }),
  stallController.deleteStall
);

// semua role yang sudah login
router.post(
  '/:id/reviews',
  authenticate,
  validate({ params: idParams, body: reviewBody }),
  reviewController.createStallReview
);

module.exports = router;