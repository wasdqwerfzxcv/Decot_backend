const bcrypt = require('bcrypt');
const { User, Workspace, Notification } = require('../models');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secretKey = process.env.JWT_SECRET_KEY;
const callbackRedirectUrl = process.env.GOOGLE_CALLBACK_REDIRECT_URL;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      role,  
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Failed to register user:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //Update user last accessed time and status
    await user.update({ lastAccessed: new Date(), status: "online" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '2h' });

    // Exclude the password from the user object before sending it
    const userResponse = { ...user.get(), password: undefined };

    return res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('Failed to login user:', error);
    return res.status(500).json({ error: 'Failed to login user' });
  }
};

const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async(err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate using Google' });
    }
    if (!user) {
      return res.redirect('/login');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '2h' });
    res.cookie('jwt', token, { httpOnly: true, secure: true });
    
    return res.redirect(callbackRedirectUrl);
    
  })(req, res, next);
};

const updateUserRole = async (req, res) => {
  const { email, role } = req.body;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      console.log(user)
      await user.update({ role: role });
      return res.status(200).json({ message: 'User role updated successfully' ,user: user });
  } catch (error) {
      console.error('Failed to update user role:', error);
      return res.status(500).json({ error: 'Failed to update user role' });
  }
};

const updateProfile = async (req, res) => {
  const { userId, username, expertise } = req.body;

  try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      await user.update({ 
        username: username,
        expertise: expertise
      });
      return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
      console.error('Failed to update profile:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
  }
};

const changePassword = async (req, res) => {
  const { userId,  newPassword } = req.body;

  try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ password: newPassword });
      return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Failed to change password:', error);
      return res.status(500).json({ error: 'Failed to change password' });
  }
};

const verifyEnteredPassword = async (req, res) => {
  const { userId, enteredPassword } = req.body;

  try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await user.comparePassword(enteredPassword);
      if (!isMatch) {
          return res.status(401).json({ error: 'Entered password does not match with current password' });
      }

      return res.status(200).json({ verified: true });
  } catch (error) {
      console.error('Failed to verify password:', error);
      return res.status(500).json({ error: 'Failed to verify password' });
  }
};

const deleteAccount = async (req, res) => {
  const { userId } = req.body;

  try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      //destroy the worldddddd!!!
      await Workspace.destroy({ where: { mentorId: userId } });
      await Notification.destroy({ where: { userId: userId } });
      await user.destroy();
      return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
      console.error('Failed to delete account:', error);
      return res.status(500).json({ error: 'Failed to delete account' });
  }
};

const uploadToS3 = async (file) => {
  const uniqueFilename = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profile-pics/${uniqueFilename}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};


const uploadProfilePic = async (req, res) => {
  const file = req.file;
  const userId = req.params.userId;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const s3Result = await uploadToS3(file);
    console.log("S3 Result:", s3Result);

    const updateResult = await User.update({ profilePic: s3Result }, { where: { id: userId } });
    console.log("Update Result:", updateResult);

    res.status(200).json({ message: 'Profile picture updated successfully', profilePicUrl: s3Result });
  } catch (error) {
    console.error('Error in uploadProfilePic:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

const getUsernameById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['username']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Failed to retrieve username:', error);
    return res.status(500).json({ error: 'Failed to retrieve username' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  googleCallback,
  updateUserRole,
  updateProfile,
  changePassword,
  deleteAccount,
  verifyEnteredPassword,
  uploadProfilePic,
  getUsernameById,
};