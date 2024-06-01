const jwt = require('jsonwebtoken');

const generateJwtToken = (user) => {
  const token = jwt.sign(
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
  return token;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      user: { id: user.id, email: user.email, username: user.username },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return refreshToken;
};

module.exports = {
  generateJwtToken,
  generateRefreshToken,
};
