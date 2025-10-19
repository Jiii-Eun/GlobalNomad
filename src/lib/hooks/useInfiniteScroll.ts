import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollQueryOptions<
  TResponse extends { cursorId?: number | null },
  TParams extends Record<string, unknown>,
> {
  queryKey: readonly unknown[];
  fetchFn: (params: TParams) => Promise<TResponse>;
  initialParams: TParams;
  enabled?: boolean;
  size?: number;
  rootRef?: React.RefObject<Element | null>;
}

export function useInfiniteScrollQuery<
  TResponse extends { cursorId?: number | null },
  TParams extends Record<string, unknown>,
>({
  queryKey,
  fetchFn,
  initialParams,
  enabled = true,
  size = 5,
  rootRef,
}: InfiniteScrollQueryOptions<TResponse, TParams>) {
  const { ref, inView } = useInView({
    threshold: 0.9,
    root: rootRef?.current ?? null,
    rootMargin: "40px",
  });

  const observerDisabled = useRef(false);

  const query = useInfiniteQuery<TResponse, Error, TResponse, readonly unknown[], number | null>({
    queryKey,
    queryFn: async ({ pageParam = null }) => {
      const params = {
        ...initialParams,
        size,
        cursorId: pageParam,
      } as TParams;
      return fetchFn(params);
    },
    getNextPageParam: (lastPage) => lastPage.cursorId ?? null,
    enabled,
    initialPageParam: null,
  });

  useEffect(() => {
    if (!inView || observerDisabled.current) return;
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    observerDisabled.current = true;
    query.fetchNextPage().finally(() => {
      setTimeout(() => {
        observerDisabled.current = false;
      }, 500);
    });
  }, [inView, query.hasNextPage, query.isFetchingNextPage]);

  return {
    ...query,
    data: (query.data as InfiniteData<TResponse> | undefined)?.pages ?? [],
    targetRef: ref,
  };
}
