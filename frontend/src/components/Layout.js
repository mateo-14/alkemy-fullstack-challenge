import Head from 'next/head';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';

export default function Layout({ children, title }) {
  const { isReady, user, logout } = useAuth();
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header>
          <nav>
            <Link href="/">
              <a className="cursor-pointer text-md hover:text-indigo-500 font-medium">Home</a>
            </Link>
            {isReady && user && (
              <button
                className="cursor-pointer text-md ml-2 hover:text-indigo-500 font-medium"
                onClick={() => logout()}
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </header>
        <main role="main" className="flex-1 flex">
          {children}
        </main>
      </div>
    </>
  );
}
