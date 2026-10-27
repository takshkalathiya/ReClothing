import api from './axios';

export const notificationApi = {
  getMyNotifications: () => api.get('/notifications'),
  markAllAsRead: () => api.patch('/notifications/mark-read'),
};
