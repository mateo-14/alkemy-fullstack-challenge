import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function AuthGuard({ children }) {
  const { user, isReady } = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      push({ pathname: '/login' });
    }
  }, [user, isReady, push]);

  return <>{isReady && user ? children : null}</>;
}
