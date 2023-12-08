const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

router.post('/workspace/:workspaceId/create', boardController.createBoard);
router.post('/join', boardController.joinBoard);
router.get('/workspace/:workspaceId', boardController.getBoards);
router.get('/workspace/:workspaceId/board/:boardId', boardController.getBoardById);
router.put('/workspace/:workspaceId/board/:boardId', boardController.updateBoard);
router.delete('/workspace/:workspaceId/board/:boardId', boardController.deleteBoard);
router.post('/workspace/:workspaceId/board/:boardId/members/:userId', boardController.addWorkspaceMember);
router.get('/workspace/:workspaceId/board/:boardId/members', boardController.getBoardMembers);
router.get('/:boardId/members/:userId', boardController.checkBoardMember);
//router.post('/upload', board.Controller.uploadImage);
//router.get('/image', boardController.retrieveImage);

module.exports = router;