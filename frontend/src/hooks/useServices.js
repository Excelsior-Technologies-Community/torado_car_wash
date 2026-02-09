import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await servicesApi.getAll();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
