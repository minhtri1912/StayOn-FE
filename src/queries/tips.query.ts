import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Get Daily Tips
export const useDailyTips = (search?: string) => {
  return useQuery({
    queryKey: ['tips_daily', search],
    queryFn: async () => {
      const url = search
        ? `api/tips/daily?search=${encodeURIComponent(search)}`
        : 'api/tips/daily';
      return BaseRequest.Get(url);
    },
    staleTime: 60000 // 1 minute
  });
};

// Get Library Tips
export const useLibraryTips = (category?: string, search?: string) => {
  return useQuery({
    queryKey: ['tips_library', category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const url = params.toString()
        ? `api/tips/library?${params.toString()}`
        : 'api/tips/library';
      return BaseRequest.Get(url);
    },
    staleTime: 60000 // 1 minute
  });
};

// Toggle Like
export const useToggleTipLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tipId,
      tipType,
      isLiked
    }: {
      tipId: string;
      tipType: 'Daily' | 'Library';
      isLiked: boolean;
    }) => {
      return BaseRequest.Post('api/tips/like', { tipId, tipType, isLiked });
    },
    onSuccess: (_, variables) => {
      // Invalidate both daily and library queries to refresh like counts
      queryClient.invalidateQueries({ queryKey: ['tips_daily'] });
      queryClient.invalidateQueries({ queryKey: ['tips_library'] });
    }
  });
};

// Track View
export const useTrackTipView = () => {
  return useMutation({
    mutationFn: async ({
      tipId,
      tipType
    }: {
      tipId: string;
      tipType: 'Daily' | 'Library';
    }) => {
      return BaseRequest.Post('api/tips/view', { tipId, tipType });
    }
  });
};
