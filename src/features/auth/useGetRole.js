import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { authApi } from '../../store/api/auth.api';
import { setAuth } from '../../store/auth/authSlice';

export const useGetRole = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['auth', 'role'],
    queryFn: authApi.getRole,
  });

  useEffect(() => {
    if (query.data?.data?.user) {
      const accessToken = localStorage.getItem('accessToken');
      const { user, isGroupAdmin } = query.data.data;
      dispatch(
        setAuth({
          accessToken,
          user: { ...user, isGroupAdmin },
        })
      );
    }
  }, [query.data, dispatch]);

  return query;
};
