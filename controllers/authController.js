const bcrypt = require('bcrypt');
// const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  console.log('Register route hit');
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return res.status(400).json({ error: 'User already exists' });
    // }

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Create a new user
    // const newUser = await User.create({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Failed to register user:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  console.log('Login route hit');
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // // Check if user exists
    // const user = await User.findOne({ where: { email } });
    // if (!user) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // // Compare passwords
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // // Generate JWT token
    // const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // return res.status(200).json({ token });
    console.log("login ")
  } catch (error) {
    console.error('Failed to login user:', error);
    return res.status(500).json({ error: 'Failed to login user' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};