import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToggleTipLike } from '@/queries/tips.query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import helper from '@/helpers/index';

interface LikeButtonProps {
  tipId: string;
  tipType: 'Daily' | 'Library';
  initialLikeCount: number;
  initialIsLiked?: boolean;
}

export default function LikeButton({
  tipId,
  tipType,
  initialLikeCount,
  initialIsLiked = false
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const toggleLikeMutation = useToggleTipLike();
  const authState = useSelector((state: RootState) => state.auth);
  const token = helper.cookie_get('AT');

  // Update state when props change
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLike = async () => {
    if (!authState.isLogin && !token) {
      // Could redirect to login here
      return;
    }

    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikeCount(newCount);

    try {
      await toggleLikeMutation.mutateAsync({
        tipId,
        tipType,
        isLiked: newIsLiked
      });
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error('Error toggling like:', error);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <button
      onClick={handleLike}
      disabled={toggleLikeMutation.isPending}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 ${
        isLiked
          ? 'bg-pink-50 text-pink-600 hover:bg-pink-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          isLiked ? 'fill-pink-600 text-pink-600' : 'fill-none'
        }`}
      />
      <span className="text-sm font-medium">{formatCount(likeCount)}</span>
    </button>
  );
}
