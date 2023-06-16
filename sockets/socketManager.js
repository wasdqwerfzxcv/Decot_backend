let userSocketMap = new Map();

const addUser = (userId, socketId) => {
  userSocketMap.set(String(userId), socketId);
};

const removeUser = (userId) => {
  userSocketMap.delete(userId);
};

const getSocketIdByUserId = (userId) => {
  return userSocketMap.get(userId);
};

const getUserSocketMapContents = () => {
  return [...userSocketMap.entries()];
};

module.exports = {
  addUser,
  removeUser,
  getSocketIdByUserId,
  getUserSocketMapContents,
};