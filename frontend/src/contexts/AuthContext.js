import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';

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
  const logout = () => {
    if (isReady && user) {
      setUser(null);
      localStorage.removeItem('token');
      push('/login');
    }
  };

  useEffect(() => {
    if (!isReady) {
      const token = localStorage.getItem('token');
      if (!token) return setIsReady(true);

      axios
        .get(`${api}/auth`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          localStorage.setItem('token', data.token);
          setUser(data);
        })
        .catch((err) => {
          if (err.response?.status === 401) localStorage.removeItem('token');
        })
        .finally(() => setIsReady(true));
    }
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ isReady, login, register, user, logout }}>
      {!isReady ? <Loader /> : children}
    </AuthContext.Provider>
  );
}
