const express = require('express');
const {
  registerUser,
  loginUser,
  currentUser,
  generateNewAccessToken,
} = require('../controllers/userController');
const validateToken = require('../middlewares/validateTokenHandler');
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/current').get(validateToken, currentUser);

router.route('/refresh-token').post(generateNewAccessToken);

module.exports = router;
