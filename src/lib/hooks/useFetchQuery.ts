import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from "@tanstack/react-query";

import { useErrorHandler } from "@/components/provider/ErrorProvider";
import { usePostToken } from "@/lib/api/auth/hooks";

export interface FetchQueryOptions<TData, TError extends Error = Error>
  extends Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn"> {
  mockData?: TData;
  onError?: (error: TError) => void;
}

export function useFetchQuery<TData, TError extends Error = Error>(
  key: QueryKey,
  queryFn?: () => Promise<TData>,
  options?: FetchQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  const { mutateAsync: refreshTokens } = usePostToken();
  const { handleError } = useErrorHandler();

  return useQuery<TData, TError, TData, QueryKey>({
    queryKey: key,

    queryFn: async (): Promise<TData> => {
      if (options?.mockData !== undefined) return options.mockData;

      if (!queryFn) {
        throw new Error("useFetchQuery에는 queryFn 또는 mockData가 필요합니다");
      }

      try {
        return await queryFn();
      } catch (err) {
        const error = err as { status?: number };

        if (error.status === 401) {
          try {
            await refreshTokens(undefined);
            return await queryFn();
          } catch {
            return null as TData;
          }
        }
        throw error;
      }
    },

    retry: false,

    onError: (error: TError) => {
      options?.onError?.(error);

      handleError(error);
    },

    ...options,
  });
}
