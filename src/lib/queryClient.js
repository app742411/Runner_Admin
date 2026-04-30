import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: false, // don't refetch on tab focus
      staleTime: 1000 * 10, // data fresh for 10 seconds
      cacheTime: 1000 * 60 * 5, // cache kept for 5 minutes
    },
    mutations: {
      retry: 0, // mutations should not auto-retry
    },
  },
});

export default queryClient;
