import ScrollToTop from '@/hooks/scroll-to-top';
import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const SystemLayout = lazy(() => import('@/components/layout/layout'));
const HomePage = lazy(() => import('@/pages/Home/index'));
const StayOnHome = lazy(() => import('@/pages/MainHome/stayonhome'));
const DetailTeam = lazy(() => import('@/pages/MainHome/detailteam'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/index'));
const LoginPage = lazy(() => import('@/pages/AuthPage/Login/index'));
const RegisterPage = lazy(() => import('@/pages/AuthPage/Register/index'));
const ContactPage = lazy(() => import('@/pages/Contact/contact'));
const ConfessionBox = lazy(() => import('@/pages/ADHDCommunity/ConfessionBox'));
const SendConfession = lazy(
  () => import('@/pages/ADHDCommunity/SendConfession')
);
const SendSuccess = lazy(() => import('@/pages/ADHDCommunity/SendSuccess'));
const AboutStayOn = lazy(() => import('@/pages/MainHome/aboutstayon'));
const ValueStayon = lazy(() => import('@/pages/MainHome/valuestayon'));
const MemberPricing = lazy(() => import('@/pages/MemberShip/MemberPricing'));
const QRpayment = lazy(() => import('@/pages/MemberShip/QRpayment'));
const QRpaymentPro = lazy(() => import('@/pages/MemberShip/QRpaymentpro'));
const DonePayment = lazy(() => import('@/pages/MemberShip/donepayment'));
const ErrorPayment = lazy(() => import('@/pages/MemberShip/errorpayment'));
const PaymentCallback = lazy(
  () => import('@/pages/MemberShip/payment-callback')
);
const MainResourse = lazy(() => import('@/pages/resourse/main-resourse'));
const Blog1 = lazy(() => import('@/pages/resourse/blog1'));
const Blog2 = lazy(() => import('@/pages/resourse/blog2'));
const Blog3 = lazy(() => import('@/pages/resourse/blog3'));
const VirtualRoomPage = lazy(() => import('@/pages/VirtualRoom'));
const TrackerShell = lazy(() => import('@/virtual-room/pages/TrackerShell'));
const Blog4 = lazy(() => import('@/pages/resourse/blog4'));
const Quiz1 = lazy(() => import('@/pages/resourse/quiz1'));
const Quiz2 = lazy(() => import('@/pages/resourse/quiz2'));
const Quiz3 = lazy(() => import('@/pages/resourse/quiz3'));
const Quiz11 = lazy(() => import('@/pages/resourse/quiz11'));
const Dapan11 = lazy(() => import('@/pages/resourse/dapan11'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const systemRoute = [
    {
      path: '/',
      element: (
        <SystemLayout>
          <Suspense>
            <ScrollToTop />
            <Outlet />
          </Suspense>
        </SystemLayout>
      ),
      children: [
        {
          element: <HomePage />,
          index: true
        },
        {
          path: '/virtual-room',
          element: <VirtualRoomPage />
        },
        // keep /vr-tracker out of SystemLayout
        {
          path: '/profile',
          element: <ProfilePage />
        },
        {
          path: '/home',
          element: <HomePage />
        },
        {
          path: '/login',
          element: <LoginPage />
        },
        {
          path: '/register',
          element: <RegisterPage />
        },
        {
          path: '/contact',
          element: <ContactPage />
        },
        {
          path: '/aboutstayon',
          element: <AboutStayOn />
        },
        {
          path: '/team',
          element: <DetailTeam />
        },
        {
          path: '/values',
          element: <ValueStayon />
        },
        {
          path: '/membership',
          element: <MemberPricing />
        },
        {
          path: '/membership/qrpayment',
          element: <QRpayment />
        },
        {
          path: '/membership/qrpayment-pro',
          element: <QRpaymentPro />
        },
        {
          path: '/membership/done',
          element: <DonePayment />
        },
        {
          path: '/membership/payment-callback',
          element: <PaymentCallback />
        },
        {
          path: '/membership/error',
          element: <ErrorPayment />
        },
        {
          path: '/community',
          element: <ConfessionBox />
        },
        {
          path: '/resources',
          element: <MainResourse />
        },
        {
          path: '/stayonhome',
          element: <StayOnHome />
        },
        {
          path: '/resources/what-is-adhd',
          element: <Blog1 />
        },
        {
          path: '/resources/symptoms',
          element: <Blog2 />
        },
        {
          path: '/resources/diagnosis',
          element: <Blog3 />
        },
        {
          path: '/resources/causes',
          element: <Blog4 />
        },
        {
          path: '/resources/quiz1',
          element: <Quiz1 />
        },
        {
          path: '/resources/quiz2',
          element: <Quiz2 />
        },
        {
          path: '/resources/quiz3',
          element: <Quiz3 />
        },
        {
          path: '/resources/quiz11',
          element: <Quiz11 />
        },
        {
          path: '/resources/dapan11',
          element: <Dapan11 />
        },

        {
          path: '/community/send',
          element: <SendConfession />
        },
        {
          path: '/community/send/success',
          element: <SendSuccess />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/vr-tracker',
      element: <TrackerShell />
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...systemRoute, ...publicRoutes]);

  return routes;
}
