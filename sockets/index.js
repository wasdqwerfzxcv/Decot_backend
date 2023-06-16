const { addUser, removeUser } = require('./socketManager');
const { setIoInstance } = require('./socketIoInstance');

const setupSockets = (io) => {
  setIoInstance(io); // set the io instance

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    addUser(userId, socket.id);
    socket.on('disconnect', () => {
      removeUser(userId);
    });
  });
};

module.exports = { setupSockets };