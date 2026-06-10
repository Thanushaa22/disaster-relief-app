const express = require('express');
const router = express.Router();
const {
  postHelpRequest,
  getHelpRequests,
  updateHelpRequestStatus
} = require('../controllers/helpController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, postHelpRequest);
router.get('/', verifyToken, getHelpRequests);
router.patch('/:id', verifyToken, updateHelpRequestStatus); // ✅ new PATCH route

module.exports = router;
