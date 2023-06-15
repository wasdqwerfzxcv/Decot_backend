const express = require('express');
const { createMessage, getAllMessages, updateMessage, deleteMessage } = require('../controllers/messageController');
const router = express.Router();

// Create a new message
router.post('/create', createMessage);

// Retrieve all messages
router.get('/list', getAllMessages);

// Update a message
router.put('/update', updateMessage);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;