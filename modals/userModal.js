const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    refreshToken: String,
    username: {
      type: String,
      required: [true, 'Please add the User Name'],
    },
    email: {
      type: String,
      required: [true, 'Please add the user email address'],
      unique: [true, 'Email address already taken'],
    },
    password: {
      type: String,
      required: [true, 'Please add the user password'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
