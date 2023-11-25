const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');

router.post('/board/:boardId/create', canvasController.createCanvas);
router.get('/board/:boardId', canvasController.getCanvases);
router.get('/board/:boardId/canvas/:canvasId', canvasController.getCanvasById);
router.put('/board/:boardId/canvas/:canvasId', canvasController.updateCanvas);
router.delete('/board/:boardId/canvas/:canvasId', canvasController.deleteCanvas);

module.exports = router;