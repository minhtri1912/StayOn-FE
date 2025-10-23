import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/ui/icons';
import { useGetInfoUser } from '@/queries/auth.query';
import { useState } from 'react';
import Order from './Order';
import helper from '@/helpers/index';
const ListMenu = [
  {
    id: 1,
    title: 'Thông tin cá nhân',
    icon: 'profile'
  },
  {
    id: 3,
    title: 'Đơn hàng',
    icon: 'truck'
  },
  {
    id: 4,
    title: 'Đăng xuất',
    icon: 'logOut'
  }
];

export default function ProfilePage() {
  const [selectedMenu, setSelectedMenu] = useState(1);
  const { data: infoUser } = useGetInfoUser();
  const { firstName, lastName, email, phoneNumber } = infoUser || {};

  console.log(infoUser);
  const _renderMenu = () => {
    switch (selectedMenu) {
      case 1:
        return (
          <>
            {' '}
            <h1 className="mb-[2%] text-lg font-bold">Thông tin cá nhân</h1>
            <div className="grid grid-cols-4">
              <div className="flex flex-col">
                <h1>Họ và tên</h1>
                <p className="flex font-normal">{`${firstName} ${lastName}`}</p>
              </div>
              <div className="flex flex-col">
                <h1>Tài khoản</h1>
                <p className="flex font-normal">{`${email}`}</p>
              </div>
              <div className="flex flex-col">
                <h1>Email</h1>
                <p className="flex font-normal">{`${email}`}</p>
              </div>
              <div className="flex flex-col">
                <h1>Số điện thoại</h1>
                <p className="flex font-normal">{`${phoneNumber}`}</p>
              </div>
            </div>
          </>
        );
      case 3:
        return <Order />;
      case 4:
        helper.cookie_delete('AT');
        window.location.href = '/login';
        return <h1>Đăng xuất</h1>;
      default:
        return <h1>Thông tin cá nhân</h1>;
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto max-h-screen w-[80%] flex-1  p-4"
        pageHead="Giỏ hàng | G-Local"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Profile', link: '/profile' }
        ]}
      >
        <div className="mt-2 grid h-full grid-cols-[30%,65%] gap-10">
          <div className="space-y-4 rounded-xl bg-background  p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-[20px] font-bold">Châu Nguyễn</h1>
            </div>
            {ListMenu.map((item) => {
              const Icon = Icons[item.icon || 'arrowRight'];
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMenu(item.id)}
                  className={`cursor-pointer rounded-md p-3 ${
                    selectedMenu === item.id ? 'bg-yellow' : 'bg-background'
                  }`}
                >
                  <h1 className="flex items-center gap-2">
                    <Icon className="size-5" />
                    {item.title}
                  </h1>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl bg-background  p-4">{_renderMenu()}</div>
        </div>
        <Footer />
      </BasePages>
    </>
  );
}
