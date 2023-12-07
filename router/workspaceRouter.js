const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const analysisController = require('../controllers/analysisController');

router.post('/create', workspaceController.createWorkspace);
router.post('/join', workspaceController.joinWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:workspaceId', workspaceController.getWorkspaceById);
router.put('/:workspaceId', workspaceController.updateWorkspace);
router.delete('/:workspaceId', workspaceController.deleteWorkspace);
router.get('/:workspaceId/members', workspaceController.getWorkspaceMembers);
router.delete('/:workspaceId/members/:userId', workspaceController.removeWorkspaceMember);
router.post('/:workspaceId/leave', workspaceController.leaveWorkspace);
router.get('/:workspaceId/menteeAnalysis', analysisController.getMenteeAnalysisData);

module.exports = router;