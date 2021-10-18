import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function useBalance() {
  const [data, setData] = useState();
  const { user, isReady } = useAuth();

  const fetch = useCallback(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/balance`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {});
  }, [user?.token, setData]);

  useEffect(() => {
    if (isReady && user) fetch();
  }, [isReady, user]);

  return { data, update: fetch };
}
