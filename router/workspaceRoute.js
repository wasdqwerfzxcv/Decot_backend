const express = require('express');
const { createWorkspace, getWorkspaces } = require('../controllers/workspaceController');
const router = express.Router();

router.post('/create', createWorkspace);
router.get('/list', getWorkspaces);

module.exports = router;