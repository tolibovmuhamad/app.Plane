import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { FormField } from '../components/FormField';
import { useSession } from '../useSession';
import { parseApiError } from '@/lib/apiError';

interface FieldErrors {
  email?: string;
  password?: string;
}

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useSession();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const nextErrors: FieldErrors = {};
    if (!values.email.trim()) nextErrors.email = 'Введите email';
    if (!values.password) nextErrors.password = 'Введите пароль';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      const to = (location.state as LocationState | null)?.from?.pathname ?? '/';
      navigate(to, { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.code === 'UNAUTHORIZED' || parsed.code === 'NOT_FOUND') {
        setFormError('Неверный email или пароль.');
      } else if (parsed.code === 'VALIDATION_ERROR') {
        setErrors(parsed.fieldErrors);
        if (Object.keys(parsed.fieldErrors).length === 0) setFormError(parsed.message);
      } else {
        setFormError(parsed.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="С возвращением"
      subtitle="Войдите в свой аккаунт."
      footer={{ text: 'Нет аккаунта?', linkText: 'Зарегистрироваться', to: '/register' }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update('email')}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={update('password')}
          error={errors.password}
        />

        {formError && <p className="text-sm text-red-400">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </AuthShell>
  );
}
