const crypto = require('crypto');
const { Workspace, User, Notification, Message, Canvas, Board, sequelize } = require('../models');
const { getIoInstance } = require('../sockets/socketIoInstance');
const { getSocketIdByUserId } = require('../sockets/socketManager');

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const joinToken = crypto.randomBytes(4).toString('hex');
    const baseUrl = 'http://localhost:3000';
    const inviteLink = `${baseUrl}/join/${joinToken}`;

    const workspace = await Workspace.create({
      name,
      description,
      joinToken,
      color,
      inviteLink,
      mentorId: req.user.id
    });

    res.status(201).json({ workspace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinWorkspace = async (req, res) => {
  try {
    const { token } = req.body;
    const io = getIoInstance();
    const workspace = await Workspace.findOne({ where: { joinToken: token } });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get the user (assuming you have middleware to authenticate user)
    const user = await User.findByPk(req.user.id);

    // Add user to workspace members here
    await workspace.addMembers(user);

    // Save notification in the database
    const notification = await Notification.create({
      content: `${user.username} has joined your ${workspace.name} workspace`,
      userId: workspace.mentorId,
    });

    const mentorSocketId = getSocketIdByUserId(String(workspace.mentorId));

    io.to(mentorSocketId).emit('notification', notification);

    res.json({ message: 'Joined workspace', workspaceId: workspace.id });
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

    await Message.destroy({ where: { workspaceId: workspaceId } });
    await Canvas.destroy({ where: { workspaceId: workspaceId } });

    const boards = await Board.findAll({
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    for (const board of boards) {
      await sequelize.query('DELETE FROM "BoardMembers" WHERE "boardId" = :boardId', {
        replacements: { boardId: board.id },
        type: sequelize.QueryTypes.DELETE
      });
      await board.destroy();
    }

    await workspace.destroy();

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getWorkspaceMembers = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    const workspace = await Workspace.findByPk(workspaceId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] }
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    res.status(200).json(workspace.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeWorkspaceMember = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.params.userId;
    const io = getIoInstance();

    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await workspace.removeMember(user);

    // Save notification in the database
    const notification = await Notification.create({
      content: `You have been removed from ${workspace.name} workspace`,
      userId: user.id,
    });


    // Emit notification to mentee using getSocketIdByUserId
    const menteeSocketId = getSocketIdByUserId(userId);
    io.to(menteeSocketId).emit('notification', notification);

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const leaveWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;
    const io = getIoInstance();

    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const mentor = await User.findByPk(workspace.mentorId); // assuming workspace has mentorId field
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    await workspace.removeMember(userId);

    const user = await User.findByPk(req.user.id);

    const notification = await Notification.create({
      content: `${user.username} has left your ${workspace.name} workspace`,
      userId: mentor.id,
    });

    const mentorSocketId = getSocketIdByUserId(String(mentor.id));
    io.to(mentorSocketId).emit('notification', notification);

    res.status(200).json({ message: 'Left workspace successfully' });
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
  leaveWorkspace,
};
