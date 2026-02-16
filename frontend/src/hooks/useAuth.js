import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    window.location.href = '/login';
  };
};
