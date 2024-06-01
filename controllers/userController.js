const expressAsyncHandler = require('express-async-handler');
const User = require('../modals/userModal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateJwtToken,
  generateRefreshToken,
} = require('../utils/generateTokens');

//@desc Register user
//@route POST /api/users
//@access public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const isUserAvailable = await User.findOne({ email });

  if (isUserAvailable) {
    res.status(400);
    throw new Error('User already exists.');
  }

  // Hasing password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('User data is not valid.');
  }
});

//@desc Login user
//@route POST /api/users
//@access public
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({ accessToken, refreshToken });
  } else {
    res.status(401);
    throw new Error('Email or Password not valid..');
  }
});

//@desc Generate new Access token from refresh token
//@route POST /api/refresh-token
//@access private
const generateNewAccessToken = expressAsyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token required to generate new access token.');
  }
  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(payload.user.id);

  if (!user || user.refreshToken !== refreshToken) {
    res.status(403);
    throw new Error('Invalid refresh token.');
  }

  const newAccessToken = generateJwtToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();
  res.json({ accessToken: newAccessToken, refreshToken: refreshToken });
});

//@desc Current user info
//@route GET /api/users
//@access private
const currentUser = expressAsyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  generateNewAccessToken,
};
