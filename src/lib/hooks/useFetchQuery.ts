import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from "@tanstack/react-query";

interface FetchQueryOptions<TData, TError extends Error = Error>
  extends Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn"> {
  mockData?: TData;
  onError?: (error: TError) => void;
}

export function useFetchQuery<TData, TError extends Error = Error>(
  key: QueryKey,
  queryFn?: () => Promise<TData>,
  options?: FetchQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, QueryKey>({
    queryKey: key,

    queryFn: async (): Promise<TData> => {
      if (options?.mockData !== undefined) return options.mockData;

      if (!queryFn) {
        throw new Error("useFetchQuery에는 queryFn 또는 mockData가 필요합니다");
      }

      try {
        const data = await queryFn();
        return data;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          (error as { status?: number }).status === 401
        ) {
          console.warn(`[useFetchQuery] 401 Unauthorized on ${String(key[0])}`);

          const unauthorized = new Error("Unauthorized") as TError & {
            silent401: boolean;
          };
          unauthorized.silent401 = true;
          throw unauthorized;
        }

        throw error as TError;
      }
    },

    retry: false,

    onError: (error: TError): void => {
      if (
        typeof error === "object" &&
        error !== null &&
        "silent401" in (error as Record<string, unknown>)
      ) {
        return;
      }

      console.error("[useFetchQuery] Error:", error);

      options?.onError?.(error);
    },

    ...options,
  });
}
