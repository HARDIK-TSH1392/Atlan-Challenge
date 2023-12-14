const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchUser');

// Import the authController
const authController = require('../controllers/authController');

// ROUTE 1: Create a User
router.post('/createuser', [
  body('name', 'Enter a valid name with a size of at least 3 characters').isLength({ min: 5 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 7 characters').isLength({ min: 7 })
], authController.createUser);

// ROUTE 2: Authenticate a User
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], authController.login);

// ROUTE 3: Get logged-in User Details
router.post('/getuser', fetchuser, authController.getUser);

module.exports = router;
