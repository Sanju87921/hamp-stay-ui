import { useState, useEffect } from "react";
import { getResortsAction } from "@/actions/resorts";
import type { Resort, FilterState, SortOption, SearchParams } from "@/types/resort";

interface UseResortsOptions {
  search?: Partial<SearchParams>;
  filters?: Partial<FilterState>;
  sort?: SortOption;
}

const MAX_PRICE = 60000;

export function useResorts({ search, filters, sort = "popularity" }: UseResortsOptions = {}) {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const result = await getResortsAction({ search, filters, sort });
      setResorts(result.resorts);
      setTotal(result.total);
      setIsLoading(false);
    }
    fetchData();
  }, [search?.location, search?.checkIn, search?.checkOut, search?.adults, search?.children, filters, sort]);

  return {
    resorts,
    total,
    isEmpty: !isLoading && resorts.length === 0,
    isLoading,
    maxPrice: MAX_PRICE,
  };
}
