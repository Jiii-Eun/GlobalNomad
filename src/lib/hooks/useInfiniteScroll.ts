"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollOptions<
  TResponse extends { cursorId?: number | null },
  TItem,
  TParams extends Record<string, unknown>,
> {
  fetchFn: (params: TParams) => Promise<TResponse>;
  selectItems: (res: TResponse) => TItem[];
  initialParams: TParams;
  initialData?: TItem[];
  initialCursorId?: number | null;
  enabled?: boolean;
  size?: number;
}

export function useInfiniteScroll<
  TResponse extends { cursorId?: number | null },
  TItem,
  TParams extends Record<string, unknown>,
>({
  fetchFn,
  selectItems,
  initialParams,
  initialData = [],
  initialCursorId = null,
  enabled = true,
  size = 5,
}: InfiniteScrollOptions<TResponse, TItem, TParams>) {
  const [items, setItems] = useState<TItem[]>(initialData);
  const [cursorId, setCursorId] = useState<number | null>(initialCursorId);
  const [hasNextPage, setHasNextPage] = useState(true);

  const isFetchingRef = useRef(false);

  const { ref: targetRef, inView } = useInView({
    threshold: 0.9,
  });

  const stableParams = useMemo(
    () => ({
      ...initialParams,
      cursorId,
      size,
    }),
    [initialParams, cursorId, size],
  );

  const fetchNext = useCallback(async () => {
    if (!enabled || isFetchingRef.current || !hasNextPage) return;
    isFetchingRef.current = true;

    try {
      const response = await fetchFn(stableParams);
      const newItems = selectItems(response);

      setItems((prev) => [...prev, ...newItems]);
      setCursorId(response.cursorId ?? null);
      setHasNextPage(Boolean(response.cursorId && newItems.length > 0));
    } catch (error) {
      console.error("Infinite scroll fetch error:", error);
      setHasNextPage(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [enabled, hasNextPage, stableParams, fetchFn, selectItems]);

  useEffect(() => {
    if (enabled) fetchNext();
  }, [enabled]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingRef.current) {
      fetchNext();
    }
  }, [inView, hasNextPage, fetchNext]);

  const reset = useCallback(() => {
    setItems([]);
    setCursorId(null);
    setHasNextPage(true);
  }, []);

  return {
    data: items,
    fetchNext,
    hasNextPage,
    targetRef,
    reset,
  };
}
