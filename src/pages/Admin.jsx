import "regenerator-runtime/runtime";
import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Fancybox from "../components/fancybox";
import { matchSorter } from "match-sorter";
import { useExportData } from "react-table-plugins";
import * as XLSX from "xlsx";
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        className="focus:ring-2 focus:ring-theme-blue-500 focus:outline-none appearance-none leading-6 text-slate-900 placeholder-slate-400 rounded-sm py-1 px-2 ring-1 ring-slate-200 shadow-sm ml-1"
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      className="focus:ring-2 focus:ring-theme-blue-500 focus:outline-none appearance-none leading-6 text-slate-900 placeholder-slate-400 rounded-sm py-1 px-2 ring-1 ring-slate-200 shadow-sm"
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className="form-control !px-1 !py-1 !rounded-sm"
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;
function Table({ columns, data }) {
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,

      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    exportData,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      getExportFileBlob,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination,
    useExportData
  );
  return (
    <div className="p-4">
      <div className="title">
        <button
          className="btn"
          onClick={() => {
            exportData("xlsx", false);
          }}
        >
          Export data as xlsx
        </button>
      </div>
      <div className="my-4 overflow-auto w-full">
        <table
          {...getTableProps()}
          className="table-auto border-collapse border border-slate-400 w-full"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border border-slate-300 px-2 py-1 text-sm text-left whitespace-nowrap"
                  >
                    {column.render("Header")}
                    <div className="py-1 ">
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th
                colSpan={visibleColumns.length}
                className="border border-slate-300 px-2 py-1 text-sm text-left"
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="border border-slate-300 px-2 py-1 text-sm whitespace-nowrap"
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
      </div>
      <div className="flex flex-wrap gap-4 items-center text-sm ">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-1 text-white bg-gray-200 rounded-sm hover:bg-theme-blue cursor-pointer  disabled:bg-gray-300 disabled:text-slate-50 disabled:cursor-default"
          >
            {"<<"}
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-1 text-white bg-gray-200 rounded-sm hover:bg-theme-blue cursor-pointer  disabled:bg-gray-300 disabled:text-slate-50 disabled:cursor-default"
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-1 text-white bg-gray-200 rounded-sm hover:bg-theme-blue cursor-pointer  disabled:bg-gray-300 disabled:text-slate-50 disabled:cursor-default"
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-1 text-white bg-gray-200 rounded-sm hover:bg-theme-blue cursor-pointer  disabled:bg-gray-300 disabled:text-slate-50 disabled:cursor-default"
          >
            {">>"}
          </button>{" "}
        </div>
        <div className="flex items-center space-x-2">
          <div>
            Page {pageIndex + 1} of {pageOptions.length} | Go to page:
          </div>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="form-control !w-10 !px-1 !py-1 !rounded-sm"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="form-control !w-28 !px-1 !py-1 !rounded-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>
          Showing the first {pageSize} results of {rows.length} rows
        </div>
      </div>
    </div>
  );
}
function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === "xlsx") {
    // XLSX example

    const header = columns.map((c) => c.exportValue);
    const compatibleData = data.map((row) => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    let wb = XLSX.utils.book_new();
    let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
      header,
    });
    XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    // Returning false as downloading of file is already taken care of
    return false;
  }

  // Other formats goes here
  return false;
}
const Admin = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [posters, setPosters] = useState([]);
  useEffect(() => {
    const userData = async () => {
      try {
        const res = await axios.get("all-users.php");
        if (res.data?.users) {
          setPosters(res.data?.users.reverse());
        }
      } catch (error) {
        console.log(error);
      }
    };
    userData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Sr",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: "Emp Id",
        accessor: (d) => d.emp_id,
      },
      {
        Header: "Emp name",
        accessor: (d) => d.emp_name,
      },
      {
        Header: "Region",
        accessor: (d) => d.region,
      },
      {
        Header: "HQ",
        accessor: (d) => d.hq,
      },
      {
        Header: "Doctor Name",
        accessor: (d) => d.doc_name,
      },
      {
        Header: "Doctor Contact",
        accessor: (d) => d.doc_contact,
      },
      // {
      //   Header: "Poster Name",
      //   accessor: (d) => d.poster_name,
      // },

      {
        Header: "Poster Image",
        accessor: "template",
        disableFilters: true,
        Cell: ({ row }) => (
          <>
            <a
              data-fancybox
              href={`${row.original.template}`}
              className="viewBtn"
            >
              {"View"}
            </a>
          </>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
      },
    ],
    []
  );
  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-xl">
        {" "}
        {isFetching && "fetching data..."}
        {!isFetching && posters.length ? (
          <Fancybox>
            <Table columns={columns} data={posters} />
          </Fancybox>
        ) : (
          <div className="p-4">No data available</div>
        )}
      </div>
    </div>
  );
};
export default Admin;
