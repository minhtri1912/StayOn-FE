import { useEffect, useMemo, useState } from 'react';
import helpers from '@/helpers';
import { useRouter } from '@/routes/hooks/use-router';
import PomodoroPage from '../../virtual-room/pages/PomodoroPage.jsx';

export default function VirtualRoomPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const accessToken = useMemo(() => helpers.cookie_get('AT'), []);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    setIsChecking(false);
  }, [accessToken, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm text-muted-foreground">
          Đang tải phòng ảo...
        </div>
      </div>
    );
  }

  // This component will host all logic and UI migrated from E:\\stayon\\react-grpc-test-
  // and provide the JWT from login via `accessToken` instead of hardcoding.
  return (
    <div className="min-h-screen">
      <PomodoroPage />
    </div>
  );
}
