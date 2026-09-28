const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');

router.get('/', stallController.getStalls);
router.get('/:id', stallController.getStallById);
router.post('/', stallController.createStall);
router.put('/:id', stallController.updateStall);
router.delete('/:id', stallController.deleteStall);

module.exports = router;