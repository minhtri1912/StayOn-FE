
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
const SendConfession = lazy(() => import('@/pages/ADHDCommunity/SendConfession'));
const SendSuccess = lazy(() => import('@/pages/ADHDCommunity/SendSuccess'));
const AboutStayOn = lazy(() => import('@/pages/MainHome/aboutstayon'));
const ValueStayon = lazy(() => import('@/pages/MainHome/valuestayon'));
const MemberPricing = lazy(() => import('@/pages/MemberShip/MemberPricing'));
const QRpayment = lazy(() => import('@/pages/MemberShip/QRpayment'));
const QRpaymentPro = lazy(() => import('@/pages/MemberShip/QRpaymentpro'));
const DonePayment = lazy(() => import('@/pages/MemberShip/donepayment'));
const ErrorPayment = lazy(() => import('@/pages/MemberShip/errorpayment'));
const PaymentCallback = lazy(() => import('@/pages/MemberShip/payment-callback'));
const MainResourse = lazy(() => import('@/pages/resourse/main-resourse'));
const Blog1 = lazy(() => import('@/pages/resourse/blog1'));
const Blog2 = lazy(() => import('@/pages/resourse/blog2'));
const Blog3 = lazy(() => import('@/pages/resourse/blog3'));
const Blog4 = lazy(() => import('@/pages/resourse/blog4'));
const Quiz1 = lazy(() => import('@/pages/resourse/quiz1'));
const Quiz2 = lazy(() => import('@/pages/resourse/quiz2'));
const Quiz3 = lazy(() => import('@/pages/resourse/quiz3'));
const Quiz11 = lazy(() => import('@/pages/resourse/quiz11'));
const Quiz12 = lazy(() => import('@/pages/resourse/quiz12'));
const Quiz13 = lazy(() => import('@/pages/resourse/quiz13'));
const Quiz14 = lazy(() => import('@/pages/resourse/quiz14'));
const Quiz15 = lazy(() => import('@/pages/resourse/quiz15'));
const Quiz21 = lazy(() => import('@/pages/resourse/quiz21'));
const Quiz22 = lazy(() => import('@/pages/resourse/quiz22'));
const Quiz23 = lazy(() => import('@/pages/resourse/quiz23'));
const Quiz24 = lazy(() => import('@/pages/resourse/quiz24'));
const Quiz25 = lazy(() => import('@/pages/resourse/quiz25'));
const Quiz31 = lazy(() => import('@/pages/resourse/quiz31'));
const Dapan31 = lazy(() => import('@/pages/resourse/dapan31'));
const Quiz32 = lazy(() => import('@/pages/resourse/quiz32'));
const Dapan32 = lazy(() => import('@/pages/resourse/dapan32'));
const Dapan11 = lazy(() => import('@/pages/resourse/dapan11'));
const Quiz33 = lazy(() => import('@/pages/resourse/quiz33'));
const Dapan33 = lazy(() => import('@/pages/resourse/dapan33'));
const Quiz34 = lazy(() => import('@/pages/resourse/quiz34'));
const Dapan34 = lazy(() => import('@/pages/resourse/dapan34'));
const Quiz35 = lazy(() => import('@/pages/resourse/quiz35'));
const Dapan35 = lazy(() => import('@/pages/resourse/dapan35'));
const Dapan12 = lazy(() => import('@/pages/resourse/dapan12'));
const Dapan13 = lazy(() => import('@/pages/resourse/dapan13'));
const Dapan14 = lazy(() => import('@/pages/resourse/dapan14'));
const Dapan15 = lazy(() => import('@/pages/resourse/dapan15'));
const Dapan21 = lazy(() => import('@/pages/resourse/dapan21'));
const Dapan22 = lazy(() => import('@/pages/resourse/dapan22'));
const Dapan23 = lazy(() => import('@/pages/resourse/dapan23'));
const Dapan24 = lazy(() => import('@/pages/resourse/dapan24'));
const Dapan25 = lazy(() => import('@/pages/resourse/dapan25'));
const FinalQuiz2 = lazy(() => import('@/pages/resourse/finalquiz2'));
const FinalQuiz = lazy(() => import('@/pages/resourse/finalquiz'));
const FinalQuiz3 = lazy(() => import('@/pages/resourse/finalquiz3'));
const TodolistPage = lazy(() => import('@/pages/resourse/todolist'));
const Planners = lazy(() => import('@/pages/resourse/planners'));
const Matrix = lazy(() => import('@/pages/resourse/matrix'));
const Cornell = lazy(() => import('@/pages/resourse/cornell'));
const AdminHome = lazy(() => import('@/pages/Admin/admin'));

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
          path: '/resources/cornell',
          element: <Cornell />
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
          path: '/resources/quiz12',
          element: <Quiz12 />
        },
        {
          path: '/resources/quiz13',
          element: <Quiz13 />
        },
        {
          path: '/resources/quiz14',
          element: <Quiz14 />
        },
        {
          path: '/resources/quiz15',
          element: <Quiz15 />
        },
        {
          path: '/resources/quiz21',
          element: <Quiz21 />
        },
        {
          path: '/resources/quiz22',
          element: <Quiz22 />
        },
        {
          path: '/resources/quiz23',
          element: <Quiz23 />
        },
        {
          path: '/resources/quiz24',
          element: <Quiz24 />
        },
        {
          path: '/resources/quiz25',
          element: <Quiz25 />
        },
        {
          path: '/resources/quiz31',
          element: <Quiz31 />
        },
        {
          path: '/resources/quiz32',
          element: <Quiz32 />
        },
        {
          path: '/resources/quiz33',
          element: <Quiz33 />
        },
        {
          path: '/resources/quiz34',
          element: <Quiz34 />
        },
        {
          path: '/resources/quiz35',
          element: <Quiz35 />
        },
        {
          path: '/resources/dapan11',
          element: <Dapan11 />
        },
        {
          path: '/resources/dapan12',
          element: <Dapan12 />
        },
        {
          path: '/resources/dapan33',
          element: <Dapan33 />
        },
        {
          path: '/resources/dapan34',
          element: <Dapan34 />
        },
        {
          path: '/resources/dapan35',
          element: <Dapan35 />
        },
        {
          path: '/resources/dapan13',
          element: <Dapan13 />
        },
        {
          path: '/resources/dapan14',
          element: <Dapan14 />
        },
        {
          path: '/resources/dapan15',
          element: <Dapan15 />
        },
        {
          path: '/resources/dapan21',
          element: <Dapan21 />
        },
        {
          path: '/resources/dapan22',
          element: <Dapan22 />
        },
        {
          path: '/resources/dapan23',
          element: <Dapan23 />
        },
        {
          path: '/resources/dapan24',
          element: <Dapan24 />
        },
        {
          path: '/resources/dapan25',
          element: <Dapan25 />
        },
        {
          path: '/resources/dapan31',
          element: <Dapan31 />
        },
        {
          path: '/resources/dapan32',
          element: <Dapan32 />
        },
        {
          path: '/resources/finalquiz2',
          element: <FinalQuiz2 />
        },
        {
          path: '/resources/finalquiz',
          element: <FinalQuiz />
        },
        {
          path: '/resources/finalquiz3',
          element: <FinalQuiz3 />
        },

        {
          path: '/resources/matrix',
          element: <Matrix />
        },
        {
          path: '/resources/planners',
          element: <Planners />
        },
        {
          path: '/resources/todolist',
          element: <TodolistPage />
        },
        {
          path: '/resources/todo',
          element: <Navigate to="/resources/todolist" replace />
        },
          // Admin routes
          {
            path: '/admin',
            element: <AdminHome />
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
