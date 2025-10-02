import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiRequest } from "@/lib/apiRequest";

interface FetchQueryOptions<T> extends UseQueryOptions<T> {
  mockData?: T;
}

export function useFetchQuery<T>(
  key: unknown[],
  endpoint: string | null,
  options?: FetchQueryOptions<T>,
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      if (endpoint === null) {
        if (options?.mockData === undefined) {
          throw new Error("mock 모드에서는 mockData가 필요합니다");
        }
        return options.mockData;
      }
      if (!endpoint) {
        throw new Error("endpoint가 필요합니다");
      }
      return apiRequest<T>(endpoint);
    },
    ...options,
  });
}
