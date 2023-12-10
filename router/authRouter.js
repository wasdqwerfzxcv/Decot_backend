const express = require('express');
const { registerUser, loginUser, googleLogin, googleCallback, updateUserRole, updateProfile, changePassword, deleteAccount, verifyEnteredPassword, uploadProfilePic, getUsernameById} = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.put('/updateRole', updateUserRole);
router.put('/updateProfile', updateProfile);
router.put('/changePassword', changePassword);
router.delete('/deleteAccount', deleteAccount);
router.post('/verifyEnteredPassword', verifyEnteredPassword);
router.post('/uploadProfilePic/:userId', upload.single('profilePic'), uploadProfilePic);
router.get('/getUsername/:userId', getUsernameById);

module.exports = router;