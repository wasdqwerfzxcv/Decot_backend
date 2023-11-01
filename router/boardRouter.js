const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

router.post('/create', boardController.createBoard);
router.post('/join', boardController.joinBoard);
router.get('/', boardController.getBoards);
router.get('/:boardId', boardController.getBoardById);
router.put('/:boardId', boardController.updateBoard);
router.delete('/:boardId', boardController.deleteBoard);
//router.post('/upload', board.Controller.uploadImage);
//router.get('/image', boardController.retrieveImage);

module.exports = router;