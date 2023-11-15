const crypto = require('crypto');
const { Canvas } = require('../models');

const saveCanvas = async (req, res) => {
    try {
      const { name, description } = req.body;
      const joinToken = crypto.randomBytes(4).toString('hex'); // This will generate a shorter random string
      
      const canvas = await Canvas.create({
        name,
        description,
        joinToken,
        mentorId: req.user.id // assuming you have middleware to authenticate user
      });
  
      res.status(201).json({ canvas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const retrieveCanvas = async (req, res) => {
    try {
        const canvasId = req.params.canvasId;
    
        const canvas = await Canvas.findByPk(canvasId);
    
        if (!canvas) {
          return res.status(404).json({ error: 'Canvas not found' });
        }
    
        res.json({ canvas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const imageUpload = async (req, res) => {
  console.log('POST request received to /imageUpload.');
  console.log('Axios POST body: ', req.body);
  res.send('POST request received on server to /imageUpload');
};

module.exports = {
    saveCanvas,
    retrieveCanvas,
    imageUpload
};