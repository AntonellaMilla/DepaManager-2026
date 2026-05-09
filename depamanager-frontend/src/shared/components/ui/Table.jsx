import { ChevronDown } from 'lucide-react';
import { TABLE_STYLES, LOADING_SPINNER } from './config/uiConfig';

const Table = ({ 
  columns, 
  data, 
  isLoading = false,
  onRowClick = null,
  striped = true,
  hoverable = true,
  sortable = false 
}) => {
  // Estado de carga
  if (isLoading) {
    return (
      <div className={TABLE_STYLES.loading}>
        <div className={`animate-spin ${LOADING_SPINNER.md} border-blue-600 border-t-transparent rounded-full mx-auto`}></div>
        <p className="mt-4 text-gray-500 font-medium">Cargando datos...</p>
      </div>
    );
  }

  // Sin datos
  if (!data || data.length === 0) {
    return (
      <div className={TABLE_STYLES.emptyState}>
        <p className="text-gray-500 font-medium">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={TABLE_STYLES.container}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className={TABLE_STYLES.header}>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className={`${TABLE_STYLES.headerCell} cursor-pointer`}
                  onClick={() => sortable && column.sortable && console.log('Sort:', column.key)}
                >
                  <div className="flex items-center gap-2 group">
                    <span>{column.header}</span>
                    {sortable && column.sortable && (
                      <ChevronDown size={16} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''} ${hoverable && onRowClick ? 'cursor-pointer hover:bg-blue-50' : TABLE_STYLES.row} transition-colors duration-150`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={TABLE_STYLES.cell}
                  >
                    {column.accessor ? column.accessor(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;