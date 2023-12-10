const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/create', commentController.createComment);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/comments', commentController.getCommentsByCanvas);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/comments/:commentId', commentController.updateComment);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/comments/:commentId', commentController.deleteComment);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/comments/:commentId/toggle-resolve', commentController.toggleCommentResolvedState);

module.exports = router;
