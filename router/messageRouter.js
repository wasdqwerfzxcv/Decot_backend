const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
// Create a new message
router.post('/create', messageController.createMessage);

// Retrieve all messages
router.get('/list', messageController.getAllMessages);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;