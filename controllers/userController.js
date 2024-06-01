const expressAsyncHandler = require('express-async-handler');
const User = require('../modals/userModal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Email or Password not valid..');
  }
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
};
