import api from './axios';

export const requestApi = {
  createRequest: (data) => api.post('/requests', data),
  getSentRequests: () => api.get('/requests/sent'),
  getReceivedRequests: () => api.get('/requests/received'),
  acceptRequest: (id) => api.patch(`/requests/${id}/accept`),
  rejectRequest: (id) => api.patch(`/requests/${id}/reject`),
  cancelRequest: (id) => api.patch(`/requests/${id}/cancel`),
};
