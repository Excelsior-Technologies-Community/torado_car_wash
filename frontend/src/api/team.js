import api from './axiosConfig';

export const teamApi = {
  getTeamMembers: (params) => api.get('/team', { params }),
  getTeamMember: (id) => api.get(`/team/${id}`)
};
