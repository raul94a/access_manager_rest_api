const router = require('express').Router();
const authController = require('../controller/auth');

router.post('/signup',authController.signup);
router.post('/login', authController.login);

exports.authRoutes = router;