import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

export default function Login() {
  return (
    <>
      <Head>
        <title>Iniciar sesión</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main role="main" className="min-h-screen flex">
        <div className="container mx-auto min-h-full flex-1 flex">
          <form className="w-full max-w-md mx-auto my-auto px-10 py-7 border border-gray-300 rounded-md">
            <h1 className="text-center font-medium text-3xl mb-8 text-indigo-600">Iniciar sesión</h1>
            <TextInput className="mb-6" type="email" label="Email" id="email" />
            <TextInput className="mb-8" type="password" label="Contraseña" id="password" />
            <Button className="w-full mb-4">Login</Button>
            <Link href="/register">
              <a className="block text-center text-gray-500 font-medium hover:text-indigo-700">
                ¿No tienes cuenta? Regístrate
              </a>
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}