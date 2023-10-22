const express = require('express');
const { registerUser, loginUser, googleLogin, googleCallback, updateUserRole } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.put('/updateRole', updateUserRole);

module.exports = router;