import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

// User endpoints
export const userService = {
  getUsers: (search) => API.get('/users', { params: { search } }),
  getUserById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  followUser: (id) => API.post(`/users/${id}/follow`),
  unfollowUser: (id) => API.delete(`/users/${id}/unfollow`),
  getFollowers: (id) => API.get(`/users/${id}/followers`),
  getFollowing: (id) => API.get(`/users/${id}/following`),
  addToWatchlist: (movieId) => API.post('/users/watchlist', { movieId }),
  removeFromWatchlist: (movieId) => API.delete(`/users/watchlist/${movieId}`),
  markAsWatched: (movieId, rating) => API.post('/users/watched', { movieId, rating })
};

// Movie endpoints
export const movieService = {
  searchMovies: (query, page) => API.get('/movies/search', { params: { query, page } }),
  getMovieDetails: (id) => API.get(`/movies/${id}`),
  getTrendingMovies: (timeWindow = 'week') => API.get('/movies/trending', { params: { timeWindow } }),
  getPopularMovies: (page = 1) => API.get('/movies/popular', { params: { page } }),
  getTopRatedMovies: (page = 1) => API.get('/movies/top-rated', { params: { page } }),
  getRecommendedMovies: () => API.get('/movies/recommended')
};

// Group endpoints
export const groupService = {
  createGroup: (data) => API.post('/groups', data),
  getGroups: (search) => API.get('/groups', { params: { search } }),
  getGroup: (id) => API.get(`/groups/${id}`),
  getGroupById: (id) => API.get(`/groups/${id}`),
  joinGroup: (id) => API.post(`/groups/${id}/join`),
  leaveGroup: (id) => API.delete(`/groups/${id}/leave`),
  startVoting: (id, data) => API.post(`/groups/${id}/voting/start`, data),
  castVote: (id, movieId, vote) => API.post(`/groups/${id}/voting/vote`, { movieId, vote }),
  voteOnMovie: (id, movieId) => API.post(`/groups/${id}/voting/vote`, { movieId })
};

// Post endpoints
export const postService = {
  createPost: (data) => API.post('/posts', data),
  getPosts: (params) => API.get('/posts', { params }),
  getPostById: (id) => API.get(`/posts/${id}`),
  updatePost: (id, data) => API.put(`/posts/${id}`, data),
  deletePost: (id) => API.delete(`/posts/${id}`),
  likePost: (id) => API.post(`/posts/${id}/like`),
  addComment: (id, content) => API.post(`/posts/${id}/comment`, { content })
};

// Recommendation endpoints
export const recommendationService = {
  sendRecommendation: (data) => API.post('/recommendations', data),
  getRecommendations: (status) => API.get('/recommendations', { params: { status } }),
  updateStatus: (id, status) => API.put(`/recommendations/${id}`, { status }),
  deleteRecommendation: (id) => API.delete(`/recommendations/${id}`)
};

// Notification endpoints
export const notificationService = {
  getNotifications: (unreadOnly) => API.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (id) => API.put(`/notifications/${id}`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`)
};

export default API;
