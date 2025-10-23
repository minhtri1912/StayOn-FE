import ScrollToTop from '@/hooks/scroll-to-top';
import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const SystemLayout = lazy(() => import('@/components/layout/layout'));
const HomePage = lazy(() => import('@/pages/Home/index'));
const StayOnHome = lazy(() => import('@/pages/MainHome/stayonhome'));
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
const MainResourse = lazy(() => import('@/pages/resourse/main-resourse'));
const Blog1 = lazy(() => import('@/pages/resourse/blog1'));
const Blog2 = lazy(() => import('@/pages/resourse/blog2'));
const Blog3 = lazy(() => import('@/pages/resourse/blog3'));
const Blog4 = lazy(() => import('@/pages/resourse/blog4'));

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
          element: <StayOnHome />,
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
          path: '/values',
          element: <ValueStayon />
        },
        {
          path: '/membership',
          element: <MemberPricing />
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
