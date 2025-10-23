import Sidebar from '../shared/sidebar';
import MobileSidebar from '../shared/mobile-sidebar';
import helper from '@/helpers/index';
import { login } from '@/redux/auth.slice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useDispatch } from 'react-redux';
import { updateCart, updateTotalItems } from '@/redux/cart.slice';
import { useGetOrderUserByStatus } from '@/queries/cart.query';
import { PagingModel } from '@/constants/data';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { mutateAsync: getOrderByStatus } = useGetOrderUserByStatus();

  var token = helper.cookie_get('AT');
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (token) {
      dispatch(login());
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      let model = { ...PagingModel, orderStatus: 1 };
      var data = await getOrderByStatus(model);
      dispatch(updateCart(data));
      dispatch(updateTotalItems(data.listObjects.length));
    };
    fetch();
  }, []);

  // Scroll to top when any button is clicked in the app.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // If the click is on a button or inside one, scroll to top.
      const button = target.closest('button');
      if (button) {
        try {
          window.scrollTo(0, 0);
        } catch (err) {
          // ignore
        }
      }
    }

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background ">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <main className="overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  );
}
