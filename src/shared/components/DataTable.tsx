import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import "./DataTable.css";

export interface DataTableColumn<T extends object> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string | number;
  pageSize?: number;
}

export default function DataTable<T extends object>({
  data,
  columns,
  getRowKey,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);
  const safePageSize = Math.max(1, Math.floor(pageSize));

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();

    if (!query) return data;

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLocaleLowerCase()
          .includes(query),
      ),
    );
  }, [columns, data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;
    return [...filteredData].sort((leftRow, rightRow) => {
      const left = leftRow[key];
      const right = rightRow[key];
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left ?? "").localeCompare(String(right ?? ""), undefined, {
              numeric: true,
              sensitivity: "base",
            });

      return direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / safePageSize));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * safePageSize;
  const paginatedData = sortedData.slice(pageStart, pageStart + safePageSize);

  return (
    <div className="data-table-container">
      <input
        type="search"
        aria-label="Search table"
        placeholder="Search..."
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setCurrentPage(1);
        }}
      />
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                aria-sort={
                  sortConfig?.key === column.key
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                {column.sortable === false ? (
                  column.header
                ) : (
                  <button
                    type="button"
                    className="data-table__sort-button"
                    onClick={() => {
                      setCurrentPage(1);
                      setSortConfig((current) =>
                        current?.key === column.key
                          ? {
                              ...current,
                              direction:
                                current.direction === "asc" ? "desc" : "asc",
                            }
                          : { key: column.key, direction: "asc" },
                      );
                    }}
                  >
                    {column.header}
                    {sortConfig?.key === column.key
                      ? sortConfig.direction === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={Math.max(columns.length, 1)}>
                {data.length === 0 ? "No records found." : "No matching records."}
              </td>
            </tr>
          ) : (
            paginatedData.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render
                      ? column.render(row)
                      : String(row[column.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <nav className="data-table__pagination" aria-label="Table pagination">
          <span>
            Showing {pageStart + 1}-
            {Math.min(pageStart + safePageSize, sortedData.length)} of{" "}
            {sortedData.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
