const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');

router.post('/workspace/:workspaceId/board/:boardId/create', canvasController.createCanvas);
router.get('/workspace/:workspaceId/board/:boardId', canvasController.getCanvases);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId', canvasController.getCanvasById);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId', canvasController.updateCanvas);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId', canvasController.deleteCanvas);

module.exports = router;