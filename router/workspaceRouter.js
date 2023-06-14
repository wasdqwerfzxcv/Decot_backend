const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

router.post('/create', workspaceController.createWorkspace);
router.post('/join', workspaceController.joinWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:workspaceId', workspaceController.getWorkspaceById);

module.exports = router;