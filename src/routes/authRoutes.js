const { authenticate } = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerBody, loginBody } = require('../validations/authSchema');

router.post('/register', validate({ body: registerBody }), authController.register);
router.post('/login', validate({ body: loginBody }), authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;