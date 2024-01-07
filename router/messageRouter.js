const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
// Create a new message
router.post('/:workspaceId/create/:userId', messageController.createMessage);

// Retrieve all messages
router.get('/:workspaceId/list', messageController.getAllMessages);

// Delete a message
router.delete('/:workspaceId/:messageId', messageController.deleteMessage);

// Update all unread messages to READ status
router.patch('/:workspaceId/updateRead', messageController.updateReadStatus);

module.exports = router;