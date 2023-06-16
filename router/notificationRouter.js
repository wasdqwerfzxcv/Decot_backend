const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getNotifications);
router.delete('/', notificationController.removeAllNotifications);
router.put('/:notificationId/read', notificationController.markNotificationAsRead);
router.put('/read', notificationController.markAllNotificationsAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;