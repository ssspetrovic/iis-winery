import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize },
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 8 }, // Set initial page size here
    },
    useSortBy,
    usePagination
  );

  const firstPageIndex = pageIndex * pageSize + 1;
  const lastPageIndex = pageIndex * pageSize + page.length;
  const totalEntries = data.length;

  const showingEntries =
    totalEntries > 8
      ? `Showing data ${firstPageIndex} to ${lastPageIndex} of ${totalEntries} entries`
      : `Showing data ${firstPageIndex} to ${Math.min(
          lastPageIndex,
          totalEntries
        )} of ${totalEntries} entries`;

  return (
    <div className="overflow-x-auto">
      <table className="table admin-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="admin-pagination-container">
        <div className="showing-entries flex text-sm text-gray-700">
          {showingEntries}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={pageIndex === 0}
            className="btn-pagination"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="btn-pagination"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="btn-pagination"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={pageIndex === pageCount - 1}
            className="btn-pagination"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
