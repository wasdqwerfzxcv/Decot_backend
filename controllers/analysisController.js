const { Workspace, User, Board, Comment, Canvas } = require('../models');
const sequelize = require('sequelize');

const getMenteeAnalysisData = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    console.log("MD got come here?")
    console.log(workspaceId)

    const engagementRate = await calculateEngagementRate(workspaceId);
    const boardStagePercentages = await calculateBoardStagePercentages(workspaceId);
    const boardCompletionRate = await calculateBoardCompletionRate(workspaceId);
    const boardCompletionRatesByStage = await calculateBoardCompletionRatesByStage(workspaceId);

    const analysisData = {
      engagementRate,
      boardStagePercentages,
      boardCompletionRate,
      boardCompletionRatesByStage,
    };

    console.log(analysisData)

    res.json({ analysisData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateEngagementRate = async (workspaceId) => {
  const activeThreshold = new Date();
  activeThreshold.setDate(activeThreshold.getDate() - 3); // Consider active if accessed in the last 3 days

  try {
    const mentees = await User.findAll({
      include: [{
        model: Workspace,
        as: 'workspaces',
        where: { id: workspaceId },
      }],
      attributes: ['id', 'username', 'lastAccessed']
    });

    const totalCommentsByMentees = await Comment.count({
      include: [{
        model: Canvas,
        attributes: [],
        required: true,
        include: [{
          model: Board,
          as: 'board',
          attributes: [],
          where: { workspaceId },
          required: true,
        }],
      }, {
        model: User,
        attributes: [],
        required: true,
        where: {
          role: 'mentee'
        }
      }],
    });
    

    const comments = await Comment.findAll({
      include: [{
        model: Canvas,
        attributes: [],
        include: [{
          model: Board,
          as: 'board',
          attributes: [],
          where: { workspaceId },
        }],
      }],
      attributes: [
        [sequelize.col('Comment.userId'), 'userId'], 
        [sequelize.fn('COUNT', sequelize.col('Comment.id')), 'commentCount']
      ],
      group: [sequelize.col('Comment.userId')],
      raw: true,
    });

    const commentMap = new Map(comments.map(comment => [comment.userId, comment.commentCount]));

    const menteeEngagementRates = mentees.map(mentee => {
      const isEngaged = mentee.lastAccessed && new Date(mentee.lastAccessed) >= activeThreshold;
      const commentCount = commentMap.get(mentee.id) || 0;
      const activeScore = isEngaged ? 30 : 0;
      const commentScore = (commentCount / totalCommentsByMentees) * 70;
      const totalScore = Math.min(activeScore + commentScore, 100);

      return {
        menteeId: mentee.id,
        username: mentee.username,
        engagementRate: totalScore
      };
    });

    const overallEngagementRate = menteeEngagementRates.length > 0
      ? menteeEngagementRates.reduce((acc, mentee) => acc + mentee.engagementRate, 0) / menteeEngagementRates.length
      : 0;

    return {
      overallEngagementRate,
      menteeEngagementRates
    };
  } catch (error) {
    console.error('Error in calculateEngagementRate:', error);
    throw error;
  }
};

const calculateBoardStagePercentages = async (workspaceId) => {
  const boards = await Board.findAll({
    where: { workspaceId },
    attributes: [
      'dtTag',
      [sequelize.fn('COUNT', sequelize.col('dtTag')), 'count']
    ],
    group: ['dtTag'],
    raw: true,
  });

  console.log(boards);

  const totalBoards = await Board.count({
    where: { workspaceId }
  });

  let stageCounts = boards.reduce((acc, board) => {
    acc[board.dtTag] = parseInt(board.count, 10);
    return acc;
  }, {});

  let stagePercentages = {};
  for (let stage in stageCounts) {
    stagePercentages[stage] = (stageCounts[stage] / totalBoards) * 100;
  }

  return stagePercentages;
};

const calculateBoardCompletionRate = async (workspaceId) => {
  const totalBoards = await Board.count({ where: { workspaceId } });
  const completedBoards = await Board.count({
    where: {
      workspaceId,
      status: 'Done' // Assuming 'Complete' is the status for finished boards
    }
  });

  return totalBoards > 0 ? (completedBoards / totalBoards) * 100 : 0;
};

const calculateBoardCompletionRatesByStage = async (workspaceId) => {
  const boards = await Board.findAll({
    where: { workspaceId },
    attributes: ['dtTag', 'status'],
    raw: true,
  });

  // Initialize stats object
  let stats = {
    completed: {},
    incomplete: {},
  };

  // Initialize total counts
  let totalCompleted = 0, totalIncomplete = 0;

  // Iterate over boards to populate stats
  boards.forEach(board => {
    const { dtTag, status } = board;
    const category = status === 'Done' ? 'completed' : 'incomplete';

    // Initialize the stage in the category if it's not already there
    if (!stats[category][dtTag]) {
      stats[category][dtTag] = 0;
    }

    // Increment the count
    stats[category][dtTag]++;

    // Increment total counters
    if (category === 'completed') totalCompleted++;
    else totalIncomplete++;
  });

  // Calculate percentage for each stage in both categories
  Object.keys(stats).forEach(category => {
    Object.keys(stats[category]).forEach(stage => {
      const count = stats[category][stage];
      stats[category][stage] = (count / (category === 'completed' ? totalCompleted : totalIncomplete)) * 100;
    });
  });

  return {
    totalCompleted,
    totalIncomplete,
    completionDetails: stats
  };
};

module.exports = {
  getMenteeAnalysisData,
};