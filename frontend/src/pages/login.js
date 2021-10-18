import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import { FieldWrapper } from '../components/FieldWrapper';
import Layout from '../components/Layout';
import TextInput from '../components/TextInput';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValidating, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errors) {
          for (const key in err.response.data.errors) {
            setError(key, { type: 'manual', message: err.response.data.errors[key] });
          }
        } else if (err.request.status === 404 || err.request.status === 401) {
          setError('request', { type: 'manual', message: 'Los datos ingresados son incorrectos.' });
        }
      } else if (err.request) {
        setError('request', {
          type: 'manual',
          message: `${err.message}. Recarga la página e intentalo nuevamente en unos minutos.`,
        });
      }
    }
  };

  useEffect(() => {
    if (isSubmitting || isValidating) clearErrors('request');
  }, [isValidating, isSubmitting]);

  return (
    <Layout title="Iniciar sesión">
      <div className="flex-1 flex">
        <form
          className="w-full max-w-md mx-auto my-auto px-10 py-7 border border-gray-300 sm:rounded-md"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h1 className="text-center font-medium text-3xl mb-8 text-indigo-600">Iniciar sesión</h1>
          <FieldWrapper className="mb-6" label="Email" errorMessage={errors.email?.message} htmlFor="email">
            <TextInput
              type="email"
              id="email"
              maxLength={100}
              {...register('email', {
                required: { value: true, message: 'Ingresa el Email' },
                maxLength: 100,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Ingresa un email válido',
                },
              })}
            />
          </FieldWrapper>

          <FieldWrapper className="mb-8" label="Contraseña" errorMessage={errors.password?.message} htmlFor="password">
            <TextInput
              className="mb-8"
              type="password"
              id="password"
              maxLength={25}
              {...register('password', {
                required: { value: true, message: 'Ingresa la contraseña' },
                maxLength: 25,
                minLength: { value: 4, message: 'La contraseña debe tener como mínimo 4 caracteres' },
              })}
            />
          </FieldWrapper>

          {errors.request && <p className="text-center font-medium text-red-500 my-2">{errors.request.message}</p>}
          <Button className="w-full mb-4" disabled={isSubmitting || !isValid}>
            Login
          </Button>
          <Link href="/register">
            <a className="block text-center text-gray-500 font-medium hover:text-indigo-700">
              ¿No tienes cuenta? Regístrate
            </a>
          </Link>
        </form>
      </div>
    </Layout>
  );
}
