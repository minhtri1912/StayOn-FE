import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/auth`;

export const useLogin = () => {
  return useMutation({
    mutationKey: ['get_advisor'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post2(`/${SUB_URL}/login`, model);
    }
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/logout`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post2(`/${SUB_URL}/register`, model);
    }
  });
};

export const useGetInfoUser = () => {
  return useQuery({
    queryKey: ['get_info_user'],
    queryFn: async () => {
      return BaseRequest.Post(`/${SUB_URL}/get-info-user`);
    },
    staleTime: 3600000
  });
};
