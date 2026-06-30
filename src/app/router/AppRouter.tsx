import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardRouteLayout } from '../layouts/DashboardRouteLayout';
import { ROUTES } from '../../core/config/routes';
import {
  ForgotPasswordPage,
  LoginPage,
  ProtectedRoute,
  RegisterPage,
} from '../../features/auth';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardRouteLayout />
          </ProtectedRoute>
        }
      />

      {/* Sprint 2+: uncomment as feature routes ship
      <Route path={ROUTES.INVENTORY} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.POS} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.SCANNER} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.TRADES} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.CRM} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.REPORTS} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      <Route path={ROUTES.ANALYTICS} element={<ProtectedRoute><DashboardRouteLayout /></ProtectedRoute>} />
      */}

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
