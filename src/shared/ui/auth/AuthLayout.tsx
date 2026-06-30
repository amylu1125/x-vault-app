import { Link } from 'react-router-dom';
import { Store, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0b1c30] text-[#eaf1ff] font-sans antialiased flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0525bb]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2e44d1]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0525bb] text-white flex items-center justify-center shadow-lg shadow-[#0525bb]/40 mb-4">
              <Store className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold font-['Geist'] uppercase tracking-wider text-[#c2c8ff] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#44e1d1]" />
              X Vault Secure Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Geist'] tracking-tight text-white">
              {title}
            </h1>
            <p className="text-sm text-[#bec6e0] mt-2 max-w-sm">{subtitle}</p>
          </div>

          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-[#bec6e0]">{footer}</div>}
        </div>
      </div>

      <footer className="relative py-4 text-center text-[10px] font-bold font-['Geist'] uppercase tracking-widest text-[#757686]">
        X Vault TCG Store OS
      </footer>
    </div>
  );
}

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export function AuthFormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
}: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold font-['Geist'] uppercase tracking-wider text-[#c2c8ff]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full bg-[#131b2e] border border-[#373f54] rounded-xl px-4 py-3 text-sm text-white placeholder-[#757686] focus:outline-none focus:ring-2 focus:ring-[#2e44d1] focus:border-[#2e44d1] transition-all"
      />
    </div>
  );
}

export function AuthLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[#bcc3ff] hover:text-white font-semibold transition-colors">
      {children}
    </Link>
  );
}

interface AuthButtonProps {
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
}

export function AuthButton({
  type = 'submit',
  disabled,
  loading,
  children,
  variant = 'primary',
  onClick,
}: AuthButtonProps) {
  const base =
    "w-full py-3 rounded-xl font-['Geist'] font-extrabold text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const styles =
    variant === 'primary'
      ? 'bg-[#0525bb] hover:bg-[#2e44d1] text-white shadow-lg shadow-[#0525bb]/30'
      : 'bg-white/5 hover:bg-white/10 text-[#c2c8ff] border border-white/10';

  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} className={`${base} ${styles}`}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function AuthAlert({ message, variant = 'error' }: { message: string; variant?: 'error' | 'success' }) {
  const styles =
    variant === 'error'
      ? 'bg-[#ba1a1a]/15 border-[#ba1a1a]/40 text-[#ffdad6]'
      : 'bg-[#006b5f]/20 border-[#44e1d1]/30 text-[#6df5e1]';

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`} role="alert">
      {message}
    </div>
  );
}
