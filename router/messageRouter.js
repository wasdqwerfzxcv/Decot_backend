const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
// Create a new message
router.post('/:workspaceId/create', messageController.createMessage);

// Retrieve all messages
router.get('/:workspaceId/list', messageController.getAllMessages);

// Delete a message
router.delete('/:workspaceId/:messageId', messageController.deleteMessage);

module.exports = router;