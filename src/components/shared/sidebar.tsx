import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo 1.png';
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
import { useGetInfoUser } from '@/queries/auth.query';
import { useRouter } from '@/routes/hooks';

const NAV_ITEMS = [
  { title: 'Phòng ảo', href: '/virtual-room' },
  { title: 'Cộng đồng ADHD', href: '/community' },
  { title: 'Tài nguyên', href: '/resources' },
  { title: 'Liên hệ', href: '/contact' },
  { title: 'Membership', href: '/membership' }
];

export default function Sidebar() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: infoUser } = useGetInfoUser();
  const avatar = infoUser?.avatar || infoUser?.profile_picture || null;

  return (
    <nav className={cn('hidden md:block w-full bg-white')}>
  <div className="relative mx-auto w-[95%] px-5">
        {/* Left - logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="logo" className="h-13 w-auto" />
          </Link>
        </div>

        {/* Center - navigation (absolutely centered) */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between w-[780px]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="px-2 py-1 text-[15px] font-medium uppercase tracking-wide hover:text-black text-gray-900"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Right - auth (anchored to right) */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center gap-4">
            {auth.isLogin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full bg-gray-200 p-0.5">
                        {avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <Icons.user className="size-5 p-1" />
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
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout());
                      router.push('/');
                    }}
                  >
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
