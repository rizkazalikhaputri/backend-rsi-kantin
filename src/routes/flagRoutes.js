const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');

router.get('/', flagController.getFlags);
router.put('/:id', flagController.updateFlagStatus);

module.exports = router;