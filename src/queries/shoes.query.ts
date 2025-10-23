import BaseRequest from '@/config/axios.config';
import { PagingModel } from '@/constants/data';
import { ProductType } from '@/types';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

const SUB_URL = `api/Shoes`;
const SUB_URL_SHOES_IMAGES = `api/ShoesImages`;

export const useGetListShoesByPaging = () => {
  return useMutation({
    mutationKey: ['get_shoes'],
    mutationFn: async (model: typeof PagingModel) => {
      return BaseRequest.Post(`/${SUB_URL}/get-all-shoes`, model);
    }
  });
};

export const useGetDetailShoes = (id: string) => {
  return useQuery({
    queryKey: ['get_detail_shoes'],
    queryFn: async () => {
      return await BaseRequest.Get(`/${SUB_URL}/get-shoes/${id}`);
    }
  });
};

export const useSearchShoes = () => {
  return useMutation({
    mutationKey: ['search_shoes'],
    mutationFn: async (model: typeof PagingModel) => {
      return await BaseRequest.Post(`/${SUB_URL}/filter-shoes-by-key`, model);
    }
  });
};

export const useGetDetailShoesImage = (id) => {
  return useQuery({
    queryKey: ['get_detail_shoes_image'],
    queryFn: async () => {
      return BaseRequest.Get(`/${SUB_URL_SHOES_IMAGES}/get-shoes-image/${id}`);
    }
  });
};

export const useGetShoesByBrand = () => {
  return useMutation({
    mutationKey: ['get_shoes_by_brand'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/${SUB_URL}/filter-shoes-by-brand`, model);
    }
  });
};

type GetRandomShoesResponse = ProductType[];

export const useGetRandomShoes = (): UseQueryResult<GetRandomShoesResponse> => {
  return useQuery({
    queryKey: ['get_random_shoes'],
    queryFn: async () => {
      return BaseRequest.Get(`/${SUB_URL}/get-random-4-shoes`);
    }
  });
};
