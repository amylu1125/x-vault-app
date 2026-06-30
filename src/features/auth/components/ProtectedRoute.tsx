import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../core/config/routes';
import { useAuth } from '../../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1c30] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0525bb] animate-pulse" />
          <p className="text-sm text-[#c2c8ff] font-['Geist']">Restoring session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
