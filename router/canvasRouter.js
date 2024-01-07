const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/workspace/:workspaceId/board/:boardId/create', canvasController.createCanvas);
router.get('/workspace/:workspaceId/board/:boardId', canvasController.getCanvases);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId', canvasController.getCanvasById);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/update', canvasController.updateCanvas);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/delete', canvasController.deleteCanvas);
// router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/update', canvasController.saveCanvasData);
router.post('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/update', upload.single('canvasData'), canvasController.uploadCanvas);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/data', canvasController.getCanvasDataById);

module.exports = router;