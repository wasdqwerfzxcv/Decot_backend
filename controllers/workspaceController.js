const crypto = require('crypto');
const { Workspace, User } = require('../models');

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const joinToken = crypto.randomBytes(4).toString('hex'); // This will generate a shorter random string
    
    const workspace = await Workspace.create({
      name,
      description,
      joinToken,
      mentorId: req.user.id // assuming you have middleware to authenticate user
    });

    res.status(201).json({ workspace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinWorkspace = async (req, res) => {
  try {
    const { token } = req.body;
    
    const workspace = await Workspace.findOne({ where: { joinToken: token } });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get the user (assuming you have middleware to authenticate user)
    const user = await User.findByPk(req.user.id);

    // Add user to workspace members here
    await workspace.addMembers(user);

    res.json({ message: 'Joined workspace' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    let workspaces;
    if (req.user.role === 'mentor') {
      workspaces = await Workspace.findAll({
        where: { mentorId: userId },
      });
    } else {
      // Retrieve workspaces that mentee has joined
      const user = await User.findByPk(userId, { include: [{ model: Workspace, as: 'workspaces' }] });
      workspaces = user.workspaces;
    }

    res.json({ workspaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ workspace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createWorkspace,
  joinWorkspace,
  getWorkspaces,
  getWorkspaceById,
};