import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth.slice';
import { useNavigate } from 'react-router-dom';
import helper from '@/helpers/index';
import { useGetInfoUser } from '@/queries/auth.query';

export default function UserNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync: logoutAccount } = useLogout();
  const { data: userInfo } = useGetInfoUser();
  const accessToken = helper.cookie_get('AT');

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await logoutAccount({ accessToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      helper.cookie_delete('AT');
      helper.cookie_delete('RT');
      helper.cookie_delete('user');
      dispatch(logout());
      navigate('/login');
    }
  };

  const userName = userInfo?.fullName || userInfo?.username || 'Admin';
  const userEmail = userInfo?.email || 'admin@gmail.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 bg-gray-300`}>
          <Avatar className="h-10 w-10 border-none">
            <AvatarImage
              src={
                'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
              }
              alt={''}
              className="border-none"
            />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/membership')}>
            Membership
            <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleLogout()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
