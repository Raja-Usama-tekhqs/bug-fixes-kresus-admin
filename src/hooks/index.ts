import { QueryClient } from '@tanstack/react-query';
import * as keys from "./keys";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ globally default to 1 day
      staleTime: 86400,
      retry: false,
      refetchOnWindowFocus: false,
      retryDelay: 1000 * 3,
    },
  },
});

export { keys };
