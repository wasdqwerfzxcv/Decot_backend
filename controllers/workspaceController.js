const Workspace = require('../models/Workspace');

exports.createWorkspace = async (req, res) => {
  try {
    const { name,description, mentorId } = req.body;
    const workspace = await Workspace.create({ name, description, mentorId });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll();
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};