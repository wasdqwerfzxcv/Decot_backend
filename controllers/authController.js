const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });

    // Exclude the password from the user object before sending it
    const userResponse = { ...user.get(), password: undefined };

    return res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('Failed to login user:', error);
    return res.status(500).json({ error: 'Failed to login user' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};