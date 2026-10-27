import api from './axios';

export const listingApi = {
  getListings: (params = {}) => api.get('/listings', { params }),
  getFeaturedListings: () => api.get('/listings/featured'),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/mine'),
  addQuestion: (id, question) => api.post(`/listings/${id}/questions`, { question }),
  answerQuestion: (id, questionId, answer) => api.patch(`/listings/${id}/questions/${questionId}`, { answer }),
};
