import api from './axios';

export const reviewApi = {
  createReview: (data) => api.post('/reviews', data),
  getSellerReviews: (sellerId) => api.get(`/reviews/seller/${sellerId}`),
};
