import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Advisory`;

const PagingModel = {
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
  orderBy: '',
  orderDirection: '',
  totalRecord: 0,
  day: 0,
  week: 0,
  month: 0,
  year: 0,
  createdBy: ''
};

export const useGetAdvisorPaging = () => {
  return useQuery({
    queryKey: ['get_advisor'],
    queryFn: async () => {
      return BaseRequest.Post(
        `/${SUB_URL}/get-advisory-by-paging`,
        PagingModel
      );
    }
  });
};
