const { addUser, removeUser } = require('./socketManager');
const { setIoInstance } = require('./socketIoInstance');
const { User } = require('../models');

const setupSockets = (io) => {
  setIoInstance(io); // set the io instance

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    addUser(userId, socket.id);

    // Update the user to online status and set their last accessed time
    updateUserStatus(userId, 'online');

    socket.on('userAction', (data) => {
      if (data.action === 'userOnline') {
        updateUserStatus(userId, 'online');
      }
      // Add more actions here if needed
      updateUserStatus(userId, 'online');
    });
    
    socket.on('disconnect', () => {
      updateUserStatus(userId, 'offline');
      removeUser(userId);
    });
  });
};

const updateUserStatus = async (userId, status) => {
  try {
    await User.update({ status: status, lastAccessed: new Date() }, { where: { id: userId } });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

module.exports = { setupSockets };