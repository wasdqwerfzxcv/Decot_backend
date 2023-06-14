const Message = require('../models/ChatMessage');

exports.createMessage = async(req, res)=>{
    try{
        const {author, message, timestamp } = req.body;
        const newMessage = await Message.create({ author, message, timestamp });
        res.status(201).json(newMessage);
    }catch(error){
        console.error('Error creating message: ', error);
        res.status(500).json({ error: 'Error occured while creating the message' });
    }
};

exports.getAllMessages = async (req,res)=>{
    try{
        const messages = await Message.findAll();
        res.json(messages);
    }catch(error){
        console.error('Error retrieving messages: ', error);
        res.status(500).json({ error: 'Error occured while retrieving the messages' });
    }
};

exports.updateMessage = async (req,res)=>{
    try{
        const { id }=req.params;
        const { message }=req.body;
        const messageToUpdate=await Message.findByPk(id);
        if(!messageToUpdate){
            return res.status(404).json({ error: 'Message not found'});
        }
        messageToUpdate.message = message;
        await messageToUpdate.save();
        res.json(messageToUpdate);
    }catch(error){
        console.error('Error updating message: ', error);
        res.status(500).json({ error: 'Error occured while updating the message' });
    }
};

exports.deleteMessage = async (req,res)=>{
    try{
        const { id }=req.params;
        const messageToDelete=await Message.findByPk(id);
        if(!messageToDelete){
            return res.status(404).json({ error: 'Message not found'});
        }
        await messageToDelete.destroy();
        res.status(204).end();
    }catch(error){
        console.error('Error deleting message: ', error);
        res.status(500).json({ error: 'Error occured while deleting the message' });
    }
};