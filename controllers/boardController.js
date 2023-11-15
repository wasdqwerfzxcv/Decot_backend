const { Board, User } = require('../models');

const createBoard = async (req, res) => {
  try {
    console.log("creating board")
    const workspaceId= req.params.workspaceId;
    const { boardTitle, dtTag, deadline, description } = req.body; 
      //let lastatime = new Date(); //simply put first
    
    const board = await Board.create({
      boardTitle,
      dtTag,
      deadline, 
      description,
      mentorId: req.user.id,
      workspaceId: workspaceId,
      //lastatime
    },{
      returning:['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'createdAt', 'updatedAt']
    });
    console.log(workspaceId);
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
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt']
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
    board = await Board.findByPk(boardId,{
      where: { workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt']
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
    const { boardTitle, dtTag, deadline, description } = req.body;
    let board;
    board = await Board.findByPk(boardId,{
      where:{ workspaceId: workspaceId},
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt']
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    board.boardTitle = boardTitle;
    board.dtTag = dtTag;
    board.deadline = deadline;
    board.description = description;
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
    let board;
    board = await Board.findByPk(boardId,{
      where:{ workspaceId: workspaceId },
      attributes: ['id', 'boardTitle', 'dtTag', 'deadline', 'description', 'mentorId', 'workspaceId', 'createdAt', 'updatedAt']
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

const saveBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await board.removeMember(user);

    res.status(200).json({ message: 'Member removed successfully' });
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
};
