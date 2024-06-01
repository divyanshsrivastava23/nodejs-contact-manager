const express = require('express');
const {
  registerUser,
  loginUser,
  currentUser,
  generateNewAccessToken,
} = require('../controllers/userController');
const validateToken = require('../middlewares/validateTokenHandler');
const validateRequest = require('../middlewares/validateRequest');
const {
  registerSchema,
  loginSchema,
} = require('../utils/authValidationSchema');
const router = express.Router();

router.route('/register').post(validateRequest(registerSchema), registerUser);

router.route('/login').post(validateRequest(loginSchema), loginUser);

router.route('/current').get(validateToken, currentUser);

router.route('/refresh-token').post(generateNewAccessToken);

module.exports = router;
