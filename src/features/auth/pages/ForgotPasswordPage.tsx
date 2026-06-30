import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../core/config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { AuthAlert, AuthButton, AuthFormField, AuthLayout } from '../../../shared/ui/auth/AuthLayout';
import { getAuthErrorMessage } from '../utils';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await resetPassword(email);
      setSuccess('If an account exists for that email, a reset link has been sent.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <>
          Remember your password?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#bcc3ff] hover:text-white font-semibold">
            Back to sign in
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

        <AuthButton loading={submitting}>Send Reset Link</AuthButton>
      </form>
    </AuthLayout>
  );
}
