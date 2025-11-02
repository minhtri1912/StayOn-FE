import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setRole, login } from '@/redux/auth.slice';
import { getRoleFromToken, getUserIdFromToken } from '@/helpers/jwt';
import helper from '@/helpers/index';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Admin' | 'User';
}

export default function ProtectedRoute({
  children,
  requiredRole
}: ProtectedRouteProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const token = helper.cookie_get('AT');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from token on mount/reload
    if (token) {
      const role = getRoleFromToken(token);
      const userId = getUserIdFromToken(token);

      if (role) {
        dispatch(setRole(role));
        // Also ensure isLogin is set
        dispatch(login({ role, userId }));
      }
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [token, dispatch]); // Only run once on mount

  // Wait for initialization to complete before making routing decisions
  if (!isInitialized) {
    // Show loading state or return null to prevent flash of wrong content
    return null;
  }

  // Check if user is logged in
  if (!authState.isLogin && !token) {
    return <Navigate to="/login" replace />;
  }

  // Get role from state or token (prioritize state after initialization)
  const currentRole =
    authState.role || (token ? getRoleFromToken(token) : null);

  // If no role requirement, allow access
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check role
  if (requiredRole === 'Admin' && currentRole !== 'Admin') {
    // Redirect non-admin users to home page
    return <Navigate to="/stayonhome" replace />;
  }

  if (
    requiredRole === 'User' &&
    currentRole !== 'User' &&
    currentRole !== 'Admin'
  ) {
    // Admin can access user routes too
    return <Navigate to="/login" replace />;
  }

  // If we reach here, user has the correct role - allow access
  return <>{children}</>;
}
