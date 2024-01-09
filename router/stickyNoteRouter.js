const express = require('express');
const router = express.Router();
const stickyNoteController = require('../controllers/stickyNoteController');

router.post('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/sticky-notes/create', stickyNoteController.createStickyNote);
router.get('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/sticky-notes', stickyNoteController.getStickyNotes);
router.put('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/sticky-notes/:stickyNoteId', stickyNoteController.updateStickyNote);
router.delete('/workspace/:workspaceId/board/:boardId/canvas/:canvasId/sticky-notes/:stickyNoteId', stickyNoteController.deleteStickyNote);

module.exports = router;
