// ============================================================
// useSearchParams — URL-first search state hook
// Reads/writes search params to the URL query string.
// Makes searches shareable & back-button compatible.
// ============================================================

import { useSearchParams as useRouterSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { SearchParams } from "../types/resort";

const DEFAULTS: SearchParams = {
  location: "",
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
};

export function useSearchParams() {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  const params: SearchParams = useMemo(
    () => ({
      location: searchParams.get("location") ?? DEFAULTS.location,
      checkIn: searchParams.get("checkIn") ?? DEFAULTS.checkIn,
      checkOut: searchParams.get("checkOut") ?? DEFAULTS.checkOut,
      adults: Number(searchParams.get("adults") ?? DEFAULTS.adults),
      children: Number(searchParams.get("children") ?? DEFAULTS.children),
    }),
    [searchParams]
  );

  const setParams = (updates: Partial<SearchParams>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: false });
  };

  const clearParams = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return { params, setParams, clearParams };
}
