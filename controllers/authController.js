const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secretKey = process.env.JWT_SECRET_KEY;
const callbackRedirectUrl = process.env.GOOGLE_CALLBACK_REDIRECT_URL;

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
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
    const redirectUrl = `${callbackRedirectUrl}?token=${token}&user=${JSON.stringify(user)}`;
    
    return res.redirect(redirectUrl);
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
      return res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
      console.error('Failed to update user role:', error);
      return res.status(500).json({ error: 'Failed to update user role' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  googleCallback,
  updateUserRole,
};