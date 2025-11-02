import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logostayon.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { logout } from '@/redux/auth.slice';
import { useLogout } from '@/queries/auth.query';
import { useGetInfoUser } from '@/queries/auth.query';
import { useRouter } from '@/routes/hooks';
import helper from '@/helpers/index';

const NAV_ITEMS = [
  { title: 'Phòng ảo', href: '/virtual-room' },
  { title: 'Cộng đồng ADHD', href: '/community' },
  { title: 'Tài nguyên', href: '/resources' },
  { title: 'Tips', href: '/tips' },
  { title: 'Liên hệ', href: '/contact' },
  { title: 'Membership', href: '/membership' }
];

export default function Sidebar() {
  // select the full auth slice so we can read auth.isLogin in JSX
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const accessToken = helper.cookie_get('AT');
  const { mutateAsync: logoutAccount } = useLogout();
  const dispatch = useDispatch();
  const { data: infoUser } = useGetInfoUser();
  const avatar = infoUser?.avatar || infoUser?.profile_picture || null;

  const handleLogout = async () => {
    await logoutAccount({ accessToken });
    helper.cookie_delete('RT');
    helper.cookie_delete('AT');
    helper.cookie_delete('user');
    router.push('/');
    dispatch(logout());
  };

  return (
    <nav
      className={cn('hidden w-full border-b border-gray-200 bg-white md:block')}
    >
      <div className="relative mx-auto w-[95%] px-5">
        {/* Left - logo */}
        <div className="flex items-center">
          <Link to="/stayonhome" className="flex items-center">
            <img
              src={logoImg}
              alt="StayOn logo"
              className="h-10 w-auto md:h-20"
            />
          </Link>
        </div>

        {/* Center - navigation (absolutely centered) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="flex w-[780px] justify-between">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="px-[-10] py-1 text-[16px] font-medium uppercase tracking-wide text-gray-900 hover:text-black"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Right - auth (anchored to right) */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 transform">
          <div className="flex items-center gap-4">
            {auth.isLogin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full bg-gray-200 p-0.5">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt="avatar"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        className="h-8 w-8 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* outer circle (black) */}
                        <circle cx="12" cy="12" r="11" fill="currentColor" />
                        {/* head (white) */}
                        <circle cx="12" cy="8.8" r="2.6" fill="#ffffff" />
                        {/* torso / shoulders (white oval) */}
                        <ellipse
                          cx="12"
                          cy="16"
                          rx="5.2"
                          ry="3"
                          fill="#ffffff"
                        />
                      </svg>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8}>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/membership')}>
                    Membership
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void handleLogout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="h-11 px-3">
                  Đăng nhập / Đăng ký
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
