const express = require('express');
const router = express.Router();
const canvasController = require('../controllers/canvasController');

router.post('/saveCanvas', canvasController.saveCanvas);
router.get('/retrieveCanvas', canvasController.retrieveCanvas);
router.post('/imageUpload', canvasController.imageUpload);

module.exports = router;