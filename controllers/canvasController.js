const { Canvas } = require('../models');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

const createCanvas = async (req, res) => {
  try {
    console.log("creating canvas")
    const boardId= req.params.boardId;
    const workspaceId= req.params.workspaceId;
    const { canvasName } = req.body; 
    
    const canvas = await Canvas.create({
      canvasName,
      workspaceId: workspaceId,
      userId: req.user.id,
      boardId: boardId,
    },{
      
      returning:['id', 'canvasName', 'userId', 'boardId', 'workspaceId', 'createdAt', 'updatedAt']
    });
    console.log(boardId);
    res.status(201).json({ canvas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCanvases = async (req, res) => {
  try {
    //const userId = req.user.id;
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;
    console.log(boardId);

    if (isNaN(parseInt(boardId))) {
      return res.status(400).json({ error: 'Invalid boardId' });
    }
    let canvases;
    canvases = await Canvas.findAll({
      where: { boardId: boardId },
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'workspaceId', 'userId', 'createdAt', 'updatedAt']
  });
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
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'workspaceId', 'userId', 'createdAt', 'updatedAt']
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
    const workspaceId = req.params.workspaceId;
    const boardId = req.params.boardId;
    const canvasId = req.params.canvasId;
    const { canvasName } = req.body;
    let canvas;
    canvas = await Canvas.findByPk(canvasId,{
      where:{ 
        boardId: boardId,
        workspaceId: workspaceId,
      },
      attributes: ['id', 'canvasName', 'canvasData', 'boardId', 'workspaceId', 'userId', 'createdAt', 'updatedAt']
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
    const workspaceId = req.params.workspaceId;
    let canvas;
    canvas = await Canvas.findByPk(canvasId,{
      where:{ 
        boardId: boardId,
        workspaceId: workspaceId,
      },
      attributes: ['id', 'canvasName', 'canvasData', 'userId', 'boardId', 'workspaceId', 'createdAt', 'updatedAt']//yet to change
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

const uploadToCanvasS3 = async (file) => {
  const uniqueFilename = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME2,
    Key: `canvas-file/${uniqueFilename}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

const uploadCanvas = async (req, res) => {
  const file = req.file;
  console.log("Uploaded file: ", file);
  const canvasId = req.params.canvasId;
  const boardId = req.params.boardId;
  const workspaceId = req.params.workspaceId;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const s3Result = await uploadToCanvasS3(file);
    console.log("S3 Result:", s3Result);

    const updateResult = await Canvas.update({ canvasData: s3Result }, { where: { id: canvasId, boardId: boardId, workspaceId: workspaceId } }); //this change
    console.log("Update Result:", updateResult);

    res.status(200).json({ message: 'Canvas data updated successfully', canvasDataUrl: s3Result });
  } catch (error) {
    console.error('Error in uploadCanvas:', error);
    res.status(500).json({ error: 'Failed to upload canvas' });
  }
};

const getCanvasDataById = async(req, res)=>{
  try {
    const canvasId = req.params.canvasId;
    const boardId = req.params.boardId;
    const workspaceId = req.params.workspaceId;
    const canvas = await Canvas.findByPk(canvasId,{
      where:{
        boardId: boardId,
        workspaceId: workspaceId,
      },
      attributes: ['id', 'canvasName', 'canvasData', 'userId', 'boardId', 'workspaceId', 'createdAt', 'updatedAt']
    });
    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }
    res.json({ canvasData: canvas.canvasData });
  } catch (error) {
    console.error('Error fetching canvas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createCanvas,
  getCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
  uploadCanvas,
  getCanvasDataById
};