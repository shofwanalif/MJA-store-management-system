const express = require('express');
const authController = require('../controllers/auth.Controller');
const validate = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);
router.get('/me', validate, authController.me);

module.exports = router;
