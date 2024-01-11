const { Message, User } = require('../models');
const { io }=require('../sockets');

const createMessage = async(req, res)=>{
    try{
        const { message } = req.body;
        const userId = req.user.id;
        const workspaceId= req.params.workspaceId;
        const msg = await Message.create({
            message,
            userId,
            timestamp: new Date(),
            workspaceId,
        },{
            returning:['id', 'message', 'userId', 'timestamp', 'createdAt', 'updatedAt', 'workspaceId']
        });
        const messageWithUser = await Message.findByPk(msg.id,{
            include: [{ model: User }],
            where:{ workspaceId: workspaceId },
            attributes:['id', 'message', 'userId', 'timestamp', 'createdAt', 'updatedAt', 'workspaceId']
        })
        //io.emit('send_message', msg)
        if(messageWithUser){
            res.status(201).json({message: messageWithUser });
        }else{
            res.status(404).json({ error: "Message created but not found" });
        }
        
    }catch(error){
        console.error('Error creating message: ', error);
        res.status(500).json({ error: error.message});
    }
};

const getAllMessages = async (req,res)=>{
    try{
        const workspaceId = req.params.workspaceId;
        console.log(workspaceId);

        if (isNaN(parseInt(workspaceId))) {
            return res.status(400).json({ error: 'Invalid workspaceId' });
        }

        let messages;
        messages = await Message.findAll({
            where: { workspaceId: workspaceId },
            include: [{ model: User}],
            order: [['createdAt', 'ASC']],
            attributes: ['id', 'message', 'userId', 'timestamp', 'createdAt', 'updatedAt', 'workspaceId']
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

const deleteMessage = async (req,res)=>{
    try{
        const messageId = req.params.messageId;
        const workspaceId = req.params.workspaceId;
        let message;
        message=await Message.findByPk(messageId,{
            where:{ workspaceId: workspaceId },
            attributes:['id', 'message', 'userId', 'timestamp', 'createdAt', 'updatedAt', 'workspaceId']
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
          }
        await message.destroy();
        res.json({ message: 'Message deleted successfully' });
    }catch(error){
        console.error('Error deleting message: ', error);
        res.status(500).json({ error: error.message });
    }
};

const updateReadStatus = async (req, res) => {
    try {
        const messageIds = req.body.messageIds;
        await Message.update(
            { read: true },
            { where: { id: messageIds } }
        );
        res.json({ message: 'All unread messages have been updated to READ successfully' });
    } catch (error) {
        console.error('Error updating read status: ', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMessage,
    getAllMessages,
    deleteMessage,
    updateReadStatus
};