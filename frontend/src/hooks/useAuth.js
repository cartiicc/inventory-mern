import { useSelector } from 'react-redux';

/**
 * Convenience hook exposing auth state + role helpers.
 */
export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
  };
};
