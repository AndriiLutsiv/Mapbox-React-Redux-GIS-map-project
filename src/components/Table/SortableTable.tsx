import { Table } from "./Table";
import useSortForTable from "../../hooks/useSortForTable";
import { getIcon } from "./utils/getIcon";
import React, { useMemo, useState } from "react";
import { Pagination } from "./Pagination";

interface Props {
  config: any,
  data: any,
  pageSize: number,
  isClickable: boolean,
  round?: boolean,
  autoColumn?: boolean,
  stickyColumn?: boolean,
  isSlim?: boolean,
}

const SortableTable: React.FC<Props> = (props) => {
  const { config, autoColumn, data = [], pageSize = 10, isClickable, round, stickyColumn, isSlim } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, data]);


  const { sortBy, sortOrder, sortedData, handleClick } = useSortForTable(currentTableData, config);

  const updatedConfig = config.map((configItem: any) => {
    if (configItem.sortValue) {
      return {
        ...configItem,
        sortedHandler: () => {
          handleClick(configItem.label as any);
        }, 
        sortedIcon: () => getIcon(configItem.label, sortBy, sortOrder)
      }
    }

    return configItem;
  });
  return (
    <>
      <Table {...props}
        data={sortedData}
        config={updatedConfig}
        isClickable={isClickable}
        round={round}
        stickyColumn={stickyColumn}
        isSlim={isSlim} />
      {data.length >= pageSize && <Pagination data={data} pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
    </>
  );
};


export default SortableTable;