import BaseRequest from '@/config/axios.config';
import { PagingModel } from '@/constants/data';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Brands`;

export const useGetAllBrands = () => {
  return useQuery({
    queryKey: ['get_all_brand'],
    queryFn: async () => {
      return BaseRequest.Post(`/${SUB_URL}/get-all-brands`, PagingModel);
    }
  });
};
