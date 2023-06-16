let io;

const setIoInstance = (instance) => {
  io = instance;
};

const getIoInstance = () => {
  if (!io) {
    throw new Error('Socket.io instance is not set');
  }
  return io;
};

module.exports = {
  setIoInstance,
  getIoInstance
};
