import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { AuthAlert, AuthButton, AuthFormField, AuthLayout } from '../../../shared/ui/auth/AuthLayout';
import { getAuthErrorMessage } from '../utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn({ email, password });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b1c30] flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-[#0525bb] animate-pulse" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your X Vault enterprise dashboard."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-[#bcc3ff] hover:text-white font-semibold">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthAlert message={error} />}

        <AuthFormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />

        <AuthFormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-[#bcc3ff] hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={submitting}>Sign In</AuthButton>
      </form>
    </AuthLayout>
  );
}
