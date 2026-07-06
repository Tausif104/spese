"use client";

import { useEffect, useMemo, useState } from "react";

type Options = {
  pageSize?: number;
  // Change this (e.g. active filters) to jump back to page 1.
  resetKey?: unknown;
};

export function usePagination<T>(items: T[], options: Options = {}) {
  const { pageSize = 10, resetKey } = options;
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Filters changed → back to the first page.
  useEffect(() => setPage(1), [resetKey]);

  // The list shrank (e.g. a row was deleted) → clamp into range.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paged = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { page, setPage, pageCount, paged, pageSize, total: items.length };
}
