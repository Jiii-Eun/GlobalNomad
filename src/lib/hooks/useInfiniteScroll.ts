import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";

export interface InfiniteQueryOptions<TResponse>
  extends Omit<
    UseInfiniteQueryOptions<TResponse, Error, TResponse, unknown[]>,
    "queryKey" | "queryFn" | "getNextPageParam"
  > {
  mockData?: TResponse;
}

interface InfiniteScrollProps<
  TResponse extends Record<string, unknown>,
  TItem extends Record<string, unknown>,
> {
  queryKey: unknown[];
  fetchData: (params: Record<string, unknown>) => Promise<TResponse>;
  selectItems: (response: TResponse) => TItem[];
  limit: number;
  cursorKey?: keyof TItem;
  totalCountKey?: keyof TResponse;
  options?: InfiniteQueryOptions<TResponse>;
}

export function useInfiniteScroll<
  TResponse extends Record<string, unknown>,
  TItem extends Record<string, unknown>,
>({
  queryKey,
  fetchData,
  selectItems,
  limit,
  cursorKey = "id",
  totalCountKey,
  options,
}: InfiniteScrollProps<TResponse, TItem>) {
  const { mockData, ...queryOptions } = options ?? {};

  return useInfiniteQuery<TResponse, Error, TResponse, unknown[]>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (mockData) return mockData;
      return fetchData({ cursorId: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      const items = selectItems(lastPage);
      const totalCount = totalCountKey ? (lastPage[totalCountKey] as number) : undefined;
      const loadedCount = allPages.flatMap(selectItems).length;

      if (totalCount !== undefined && loadedCount >= totalCount) return undefined;
      if (items.length < limit) return undefined;

      const lastItem = items[items.length - 1];
      return (lastItem?.[cursorKey] as number) ?? undefined;
    },
    initialPageParam: 0,
    ...queryOptions,
  });
}
