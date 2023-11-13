import { useState } from "react";

enum SortTypes {
  ASC = 'asc',
  DESC = 'desc'
}

type SortType = null | SortTypes.ASC | SortTypes.DESC;

const useSortForTable = (data: any, config: any) => {
  const [sortOrder, setSortOrder] = useState<SortType>(null);
  const [sortBy, setSortBy] = useState<SortType>(null);

  const handleClick = (label: SortType) => {
    if (label !== sortBy && label) {
      setSortOrder(SortTypes.ASC);
      setSortBy(label);
      return;
    }
    if (sortOrder === null) {
      setSortOrder(SortTypes.ASC);
      setSortBy(label);
    }

    if (sortOrder === SortTypes.ASC) {
      setSortOrder(SortTypes.DESC);
      setSortBy(label);
    }

    if (sortOrder === SortTypes.DESC) {
      setSortOrder(null);
      setSortBy(null);
    }
  };

  let sortedData = data;
  if (sortBy && sortOrder) {
    const { sortValue } = config.find((item: any) => item.label === sortBy);
    sortedData = [...data].sort((a, b) => {
      const valA = sortValue(a);
      const valB = sortValue(b);

      const reversed = sortOrder === SortTypes.ASC ? 1 : -1;

      if (typeof valA === "string") {
        return valA.localeCompare(valB) * reversed;
      }

      return (valA - valB) * reversed;
    });
  };

  return {
    sortBy,
    sortOrder,
    sortedData,
    handleClick,
  };
};


export default useSortForTable;