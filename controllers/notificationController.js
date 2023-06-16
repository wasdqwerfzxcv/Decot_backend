const { Notification } = require('../models');

const getNotifications = async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      if (notifications && notifications.length > 0) {
        res.json({ notifications });
      } else {
        res.json({ notifications: [], message: "No notifications found" });
      }
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const removeAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
    
        // Only remove notifications where read is true
        await Notification.destroy({ where: { userId, read: true } });
    
        res.json({ message: 'All read notifications removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findByPk(notificationId);
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      notification.read = true;
      await notification.save();
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id; 
    const notifications = await Notification.findAll({ where: { userId, read: false } });

    if (notifications && notifications.length > 0) {
      for (const notification of notifications) {
        notification.read = true;
        await notification.save();
      }
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      await Notification.destroy({ where: { id: notificationId } });
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
module.exports = {
getNotifications,
removeAllNotifications,
markNotificationAsRead,
deleteNotification,
markAllNotificationsAsRead
};
  
  
  
  
  
  