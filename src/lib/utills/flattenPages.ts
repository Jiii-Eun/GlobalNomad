export function flattenPages<TPage, TItem>(
  pages: TPage[] | undefined,
  selector: (page: TPage) => TItem[] | undefined | null,
): TItem[] {
  if (!pages) return [];
  return pages.flatMap((page) => selector(page) ?? []);
}
