import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { FormField } from '../components/FormField';
import { useSession } from '../useSession';
import { parseApiError } from '@/lib/apiError';

interface FieldErrors {
  email?: string;
  password?: string;
  display_name?: string;
}

function validate(values: {
  email: string;
  password: string;
  display_name: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.email.trim()) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Некорректный email';
  }
  if (values.password.length < 8) {
    errors.password = 'Минимум 8 символов';
  }
  const name = values.display_name.trim();
  if (name.length < 1) {
    errors.display_name = 'Введите имя';
  } else if (name.length > 100) {
    errors.display_name = 'Не более 100 символов';
  }
  return errors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useSession();

  const [values, setValues] = useState({ email: '', password: '', display_name: '' });
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

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: values.email.trim(),
        password: values.password,
        display_name: values.display_name.trim(),
      });
      navigate('/', { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.code === 'CONFLICT') {
        setErrors({ email: 'Этот email уже зарегистрирован' });
      } else if (parsed.code === 'VALIDATION_ERROR') {
        setErrors(parsed.fieldErrors);
        if (Object.keys(parsed.fieldErrors).length === 0) {
          setFormError(parsed.message);
        }
      } else {
        setFormError(parsed.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="Зарегистрируйтесь, чтобы начать работу."
      footer={{ text: 'Уже есть аккаунт?', linkText: 'Войти', to: '/login' }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="display_name"
          label="Имя"
          type="text"
          autoComplete="name"
          value={values.display_name}
          onChange={update('display_name')}
          error={errors.display_name}
        />
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
          autoComplete="new-password"
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
          {submitting ? 'Создаём…' : 'Зарегистрироваться'}
        </button>
      </form>
    </AuthShell>
  );
}
