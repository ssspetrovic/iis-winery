import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid";

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
    <>
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="w-full table-auto divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " ▼"
                                : " ▲"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap border border-gray-200"
                            >
                              <div className="ml-2">{cell.render("Cell")}</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex text-sm text-gray-700">
          {showingEntries}
          <button
            onClick={() => gotoPage(0)}
            disabled={pageIndex === 0}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-2"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-2"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={pageIndex === pageCount - 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md ml-2"
          >
            <ArrowRightIcon className="h-5 w-5" />
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Table;
