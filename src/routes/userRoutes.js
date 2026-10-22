const express = require('express');
const router = express.Router();
const { createUser, getUserById, updateUser, deleteUser, loginUser } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/user', createUser);
router.post('/user/token', loginUser);
router.get('/user/:id', authMiddleware, getUserById);
router.put('/user/:id', authMiddleware, updateUser);
router.delete('/user/:id', authMiddleware, deleteUser);

module.exports = router;
