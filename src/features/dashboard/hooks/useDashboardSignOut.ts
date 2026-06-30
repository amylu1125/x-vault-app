import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/routes';
import { useAuth } from '../../../hooks/useAuth';

export function useDashboardSignOut() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate, signOut]);

  return { authEmail: user?.email, handleSignOut };
}
