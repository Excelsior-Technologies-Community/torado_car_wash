import api from './axios';

export const teamApi = {
  getTeamMembers: (params) => api.get('/team', { params }),
  getTeamMember: (id) => api.get(`/team/${id}`)
};
