const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;