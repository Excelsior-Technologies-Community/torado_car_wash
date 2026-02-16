import { useEffect, useMemo, useState } from 'react';

const DataTable = ({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  actions = true,
  enablePagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalRows = Array.isArray(data) ? data.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [data, pageSize]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize, enablePagination]);

  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const pageWindow = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-[11px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedData.map((row, rowIdx) => (
            <tr key={row?.id ?? rowIdx} className="hover:bg-gray-50 transition">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                  {col.render ? col.render(row) : row[col.field]}
                </td>
              ))}
              {actions && (
                <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                  <div className="inline-flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                        title="View"
                        aria-label="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {enablePagination && totalRows > 0 && (
        <div className="border-t px-3 sm:px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
            <span>
              Showing {startRow}-{endRow} of {totalRows}
            </span>
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1 text-xs sm:text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prev
            </button>
            {pageWindow.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
                  currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
