import api from './axios';

export const messageApi = {
  sendMessage: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessagesWithUser: (otherUserId) => api.get(`/messages/${otherUserId}`),
};
