export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const message = String((error as { message: string }).message);

  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }

  if (message.includes('User already registered')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters.';
  }

  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }

  return message;
}
