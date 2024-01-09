const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/workspace/:workspaceId/create', boardController.createBoard);
router.post('/join', boardController.joinBoard);
router.get('/workspace/:workspaceId', boardController.getBoards);
router.get('/workspace/:workspaceId/board/:boardId', boardController.getBoardById);
router.put('/workspace/:workspaceId/board/:boardId', boardController.updateBoard);
router.delete('/workspace/:workspaceId/board/:boardId', boardController.deleteBoard);
router.post('/workspace/:workspaceId/board/:boardId/members/:userId/add', boardController.addWorkspaceMember);
router.get('/workspace/:workspaceId/board/:boardId/members', boardController.getBoardMembers);
router.delete('/workspace/:workspaceId/board/:boardId/members/:userId/delete', boardController.deleteBoardMember);
router.get('/:boardId/members/:userId', boardController.checkBoardMember);

module.exports = router;