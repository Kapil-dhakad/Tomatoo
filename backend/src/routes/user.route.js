const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/user.controller');

// /api/users/register
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me', authMiddleware, getMe);        // authMiddleware se userId milta hai
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;
