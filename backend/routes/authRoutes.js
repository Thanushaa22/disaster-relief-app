const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/login', login);  // <--- Add this line

module.exports = router;
