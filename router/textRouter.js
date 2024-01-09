const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

router.post('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/texts/create', textController.createText);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/texts', textController.getTexts);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/texts/:textId', textController.updateText);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/texts/:textId', textController.deleteText);

module.exports = router;
