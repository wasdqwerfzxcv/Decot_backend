const { sequelize, Board, User, Canvas, Workspace, Notification } = require('../models');
const { getIoInstance } = require('../sockets/socketIoInstance');
const { getSocketIdByUserId } = require('../sockets/socketManager');

const createBoard = async (req, res) => {
  try {
    console.log("creating board")
    const workspaceId = req.params.workspaceId;
    const { boardTitle, dtTag, deadline, description, status } = req.body;

    const board = await Board.create({
      boardTitle,
      dtTag,
      deadline,
      description,
      status,
      mentorId: req.user.id,
      workspaceId: workspaceId,
    }, {
      returning: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });
    res.status(201).json({ board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinBoard = async (req, res) => {
  try {
    const board = await Board.findOne({});

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Get the user (assuming you have middleware to authenticate user)
    const user = await User.findByPk(req.user.id);

    // Add user to board members here
    await board.addMembers(user);

    res.json({ message: 'Joined board' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoards = async (req, res) => {
  try {
    //const userId = req.user.id;
    const workspaceId = req.params.workspaceId;
    console.log(workspaceId);

    if (isNaN(parseInt(workspaceId))) {
      return res.status(400).json({ error: 'Invalid workspaceId' });
    }
    let boards;
    boards = await Board.findAll({
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    res.json({ boards });
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const boardId = req.params.boardId;
    let board;
    board = await Board.findByPk(boardId, {
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json({ board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;
    const { boardTitle, dtTag, deadline, description, status } = req.body;
    let board;
    board = await Board.findByPk(boardId, {
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    board.boardTitle = boardTitle;
    board.dtTag = dtTag;
    board.deadline = deadline;
    board.description = description;
    board.status = status;
    await board.save();

    res.json({ board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;

    await Canvas.destroy({
      where: { boardId: boardId },
      attributes: ['id', 'canvasName', 'canvasData', 'userId', 'boardId', 'workspaceId', 'createdAt', 'updatedAt']
    })

    await sequelize.query('DELETE FROM "BoardMembers" WHERE "boardId" = :boardId', {
      replacements: { boardId: boardId },
      type: sequelize.QueryTypes.DELETE
    });

    let board;
    board = await Board.findByPk(boardId, {
      where: { workspaceId: workspaceId },
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] } // Hide the join table
        },
      ],
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    await board.destroy();
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addWorkspaceMember = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    const io = getIoInstance();
    const workspace = await Workspace.findByPk(workspaceId);

    let board;
    board = await Board.findByPk(boardId, {
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);

    const data = await board.addMember(user);
    console.log(data)

    // Save notification in the database
    const notification = await Notification.create({
      content: `You have been added to ${board.boardTitle} board in ${workspace.name}`,
      userId: user.id,
    });

    // // Emit notification to mentee using getSocketIdByUserId
    const menteeSocketId = getSocketIdByUserId(userId);
    io.to(menteeSocketId).emit('notification', notification);

    res.status(200).json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoardMembers = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;
    const board = await Board.findByPk(boardId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] } // Hide the join table
        },
      ],
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json(board.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBoardMember = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    const io = getIoInstance();
    const workspace = await Workspace.findByPk(workspaceId);

    let board;
    board = await Board.findByPk(boardId, {
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt', 'status']
    });

    await sequelize.query('DELETE FROM "BoardMembers" WHERE "boardId" = :boardId AND "userId" = :userId', {
      replacements: { boardId: boardId, userId: userId },
      type: sequelize.QueryTypes.DELETE
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = await board.removeMember(user);

    // Save notification in the database
    const notification = await Notification.create({
      content: `You have been removed from ${board.boardTitle} board in ${workspace.name}`,
      userId: user.id,
    });

    // // Emit notification to mentee using getSocketIdByUserId
    const menteeSocketId = getSocketIdByUserId(userId);
    io.to(menteeSocketId).emit('notification', notification);

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkBoardMember = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.params.userId;

    const result = await sequelize.query(
      'SELECT * FROM "BoardMembers" WHERE "boardId" = :boardId AND "userId" = :userId',
      {
        replacements: { boardId, userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      res.status(200).json({ isMember: true });
    } else {
      res.status(200).json({ isMember: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBoard,
  joinBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addWorkspaceMember,
  getBoardMembers,
  deleteBoardMember,
  checkBoardMember,
};
