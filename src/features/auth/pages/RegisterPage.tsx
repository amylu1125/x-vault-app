import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { AuthAlert, AuthButton, AuthFormField, AuthLayout } from '../../../shared/ui/auth/AuthLayout';
import { getAuthErrorMessage } from '../utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const { needsEmailConfirmation } = await signUp({ email, password });

      if (needsEmailConfirmation) {
        setSuccess('Check your email to confirm your account, then sign in.');
        return;
      }

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
      title="Create your account"
      subtitle="Register to start managing your TCG vault operations."
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#bcc3ff] hover:text-white font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthAlert message={error} />}
        {success && <AuthAlert message={success} variant="success" />}

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
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        <AuthFormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat your password"
          autoComplete="new-password"
        />

        <AuthButton loading={submitting}>Create Account</AuthButton>
      </form>
    </AuthLayout>
  );
}
