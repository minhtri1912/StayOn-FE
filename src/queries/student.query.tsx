import { useMutation, useQuery } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
const SUB_URL = `api/Student`;

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

const PagingModelToday = {
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
  orderBy: '',
  orderDirection: '',
  totalRecord: 0,
  day: 21,
  week: 0,
  month: 0,
  year: 0,
  createdBy: ''
};

interface CheckInData {
  id: number;
  userId: number;
  status: number;
  classId: number;
}

export function useGetStudentPaging() {
  return useQuery({
    queryKey: ['get_student2'],
    queryFn: async () => {
      return BaseRequest.Post(
        `/${SUB_URL}/get-list-student-by-class-id/2`,
        PagingModel
      );
    }
  });
}

export function useInitCheckInStudent() {
  return useQuery({
    queryKey: ['init_checkin_student'],
    queryFn: async () => {
      return BaseRequest.Get(`/${SUB_URL}/init-check-in-student/2`);
    },
    retry: 2
  });
}

export function useGetListCheckInStudent() {
  return useMutation({
    mutationKey: ['get_list_checkin_student'],
    mutationFn: async () => {
      return BaseRequest.Post(
        `/${SUB_URL}/get-list-check-in-student-by-paging?classId=2`,
        PagingModelToday
      );
    }
  });
}

export function useCheckInStudent() {
  return useMutation({
    mutationKey: ['check_in_student'],
    mutationFn: async (data: CheckInData) => {
      return BaseRequest.Post(
        `/${SUB_URL}/create-update-check-in-student`,
        data
      );
    }
  });
}
