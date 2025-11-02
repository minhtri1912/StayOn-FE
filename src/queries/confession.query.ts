import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Create confession
export const useCreateConfession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      content: string;
      title?: string;
      isAnonymous: boolean;
      userId: string;
    }) => {
      return BaseRequest.Post('api/confessions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    }
  });
};

// Get confessions list
export const useGetConfessions = (sort: string = 'latest') => {
  return useQuery({
    queryKey: ['confessions', sort],
    queryFn: async () => {
      return BaseRequest.Get(`api/confessions?sort=${sort}`);
    },
    staleTime: 30000 // 30 seconds
  });
};

// Get confession detail
export const useGetConfession = (id: string) => {
  return useQuery({
    queryKey: ['confession', id],
    queryFn: async () => {
      return BaseRequest.Get(`api/confessions/${id}`);
    },
    enabled: !!id
  });
};
