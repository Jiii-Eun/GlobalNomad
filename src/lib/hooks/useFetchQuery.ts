import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface FetchQueryOptions<T> extends UseQueryOptions<T> {
  mockData?: T;
}

export function useFetchQuery<T>(
  key: unknown[],
  queryFn?: () => Promise<T>,
  options?: FetchQueryOptions<T>,
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      // Mock 모드
      if (options?.mockData !== undefined) {
        return options.mockData;
      }
      if (!queryFn) {
        throw new Error("useFetchQuery에는 queryFn 또는 mockData가 필요합니다");
      }

      // API 모드
      return queryFn();
    },
    ...options,
  });
}
