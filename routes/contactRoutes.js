const express = require('express');
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContact,
} = require('../controllers/contactController');
const validateToken = require('../middlewares/validateTokenHandler');
const validateRequest = require('../middlewares/validateRequest');
const { createContactSchema } = require('../utils/contactValidationSchema');

const router = express.Router();

router.use(validateToken);

router.route('/').get(getContacts);

router.route('/').post(validateRequest(createContactSchema), createContact);

router.route('/:id').get(getContact);

router.route('/:id').put(updateContact);

router.route('/:id').delete(deleteContact);

module.exports = router;
