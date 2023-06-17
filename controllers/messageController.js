const { Message } = require('../models');

const createMessage = async(req, res)=>{
    try{
        const { message } = req.body;
        const userId = req.user.id;
        const msg = await Message.create({
            message,
            userId,
            timestamp: new Date(),
        });
        console.log(msg)
        res.status(201).json({msg});
    }catch(error){
        console.error('Error creating message: ', error);
        res.status(500).json({ error: error.message});
    }
};

const getAllMessages = async (req,res)=>{
    try{
        const userId = req.user.id;
        console.log('hihi',userId)
        const messages = await Message.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        if(messages&&messages.length>0){
            res.json({ messages });
        }else{
            res.json({ messages: [], display: "No messages found" });
        }
    }catch(error){
        console.error('Error retrieving messages: ', error);
        res.status(500).json({ error: error.message });
    }
};

// const updateMessage = async (req,res)=>{
//     try{
//         const { id }=req.params;
//         const { message }=req.body;
//         const messageToUpdate=await Message.findByPk(id);
//         if(!messageToUpdate){
//             return res.status(404).json({ error: 'Message not found'});
//         }
//         messageToUpdate.message = message;
//         await messageToUpdate.save();
//         res.json(messageToUpdate);
//     }catch(error){
//         console.error('Error updating message: ', error);
//         res.status(500).json({ error: 'Error occured while updating the message' });
//     }
// };

const deleteMessage = async (req,res)=>{
    try{
        const messageId = req.params.messageId;
        await Message.destroy({ where: { id: messageId }});
        res.json({ message: 'Message deleted successfully' });
    }catch(error){
        console.error('Error deleting message: ', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMessage,
    getAllMessages,
    deleteMessage
};