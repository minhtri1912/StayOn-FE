import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api`;

export const useLogin = () => {
  return useMutation({
    mutationKey: ['get_advisor'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post2(`/${SUB_URL}/auth/login`, model);
    }
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/auth/logout`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post2(`/${SUB_URL}/auth/register`, model);
    }
  });
};

export const useGetInfoUser = () => {
  return useQuery({
    queryKey: ['get_info_user'],
    queryFn: async () => {
      return BaseRequest.Get(`/${SUB_URL}/users/profile`);
    },
    staleTime: 3600000
  });
};

export const useEditProfile = () => {
  return useMutation({
    mutationKey: ['edit_profile'],
    mutationFn: async (model: {
      fullName?: string;
      phone?: string;
      email?: string;
      displayName?: string;
    }) => {
      return BaseRequest.Put(`/${SUB_URL}/users/profile`, model);
    }
  });
};
