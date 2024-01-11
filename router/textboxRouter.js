const express = require('express');
const router = express.Router();
const textboxController = require('../controllers/textboxController');

router.post('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/textboxes/create', textboxController.createTextbox);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/textboxes', textboxController.getTextboxes);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/textboxes/:textboxId', textboxController.updateTextbox);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/textboxes/:textboxId', textboxController.deleteTextbox);

module.exports = router;
