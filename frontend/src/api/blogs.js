import api from './axiosConfig';

export const blogsApi = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  getCategories: () => api.get('/blog-categories'),
  getTags: () => api.get('/tags')
};
