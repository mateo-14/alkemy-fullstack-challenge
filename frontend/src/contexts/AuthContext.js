import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const AuthContext = React.createContext();

const api = process.env.NEXT_PUBLIC_API_URL;
export function AuthProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState();
  const { push } = useRouter();

  const auth = async (postData, endpoint) => {
    if (!isReady || user) return;
    const { data } = await axios.post(`${api}/auth/${endpoint}`, postData);
    setUser(data);
    localStorage.setItem('token', data.token);
    push('/');
  };

  const login = (data) => auth(data, 'login');
  const register = (data) => auth(data, 'register');

  useEffect(() => {
    if (!isReady) {
      const token = localStorage.getItem('token');
      if (!token) return setIsReady(true);

      axios
        .get(`${api}/auth`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          localStorage.setItem('token', data.token);
          setUser(data);
          push('/');
        })
        .catch((err) => {
          if (err.response?.status === 401) localStorage.removeItem('token');
        })
        .finally(() => setIsReady(true));
    }
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ isReady, login, register, user }}>
      {!isReady ? (
        <div className="min-h-screen flex justify-center items-center">
          <svg
            className="animate-spin h-20 w-20 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
