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

const updateWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { name, description } = req.body;
    
    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    workspace.name = name;
    workspace.description = description;
    await workspace.save();

    res.json({ workspace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    await workspace.destroy();

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkspaceMembers = async (req, res) => {
  console.log("getWorkspaceMembers function called");
  try {
    const workspaceId = req.params.workspaceId;
    
    const workspace = await Workspace.findByPk(workspaceId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] } // Hide the join table
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    console.log("Workspace data: ", JSON.stringify(workspace, null, 2));
    console.log("got come here?  " + workspace.members);
    res.status(200).json(workspace.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeWorkspaceMember = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.params.userId;

    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await workspace.removeMember(user);

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWorkspace,
  joinWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  removeWorkspaceMember,
};
