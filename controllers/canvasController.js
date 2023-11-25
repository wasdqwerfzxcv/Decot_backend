const crypto = require('crypto');
const { Canvas, User } = require('../models');

const createCanvas = async (req, res) => {
  try {
    console.log("creating canvas")
    const boardId= req.params.boardId;
    const { canvasName } = req.body; 
    
    const canvas = await Canvas.create({
      canvasName,

      userId: req.user.id,
      boardId: boardId,
    },{
      returning:['id', 'canvasName', 'canvasData', 'userId', 'boardId', 'createdAt', 'updatedAt']
    });
    console.log(boardId);
    res.status(201).json({ canvas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCanvases = async (req, res) => { //need modify
  try {
    //const userId = req.user.id;
    const boardId = req.params.boardId;
    console.log(boardId);

    if (isNaN(parseInt(boardId))) {
      return res.status(400).json({ error: 'Invalid boardId' });
    }
    let canvases;
    canvases = await Canvas.findAll({
      where: { boardId: boardId },
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'userId', 'createdAt', 'updatedAt']
  });
    console.log("hi are u there")
    res.json({ canvases });
  } catch (error) {
    console.error("Error fetching canvases:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCanvasById = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const canvasId = req.params.canvasId;
    let canvas;
    canvas = await Canvas.findByPk(canvasId,{
      where: { boardId: boardId },
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'userId', 'createdAt', 'updatedAt']
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    res.json({ canvas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCanvas = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const canvasId = req.params.canvasId;
    const { canvasName } = req.body;
    let canvas;
    canvas = await Canvas.findByPk(canvasId,{
      where:{ boardId: boardId},
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'userId', 'createdAt', 'updatedAt']
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    canvas.canvasName = canvasName;
    await canvas.save();

    res.json({ canvas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCanvas = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;
    const boardId = req.params.boardId;
    let canvas;
    canvas = await Canvas.findByPk(canvasId,{
      where:{ boardId: boardId },
      attributes: ['id', 'canvasName', 'userId', 'boardId', 'createdAt', 'updatedAt']//yet to change
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    await canvas.destroy();

    res.json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    createCanvas,
    getCanvases,
    getCanvasById,
    updateCanvas,
    deleteCanvas,
};