import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Filter, ArrowUpDown 
} from 'lucide-react';
import Select from './Select';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (row: T) => any; // Function to get value for sorting/filtering
  render?: (row: T) => React.ReactNode; // Custom render
  sortable?: boolean; // Defaults to true
  className?: string; // Cell className
  headerClassName?: string; // Header className
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  initialPageSize?: number;
  maxHeight?: string; // Optional max height for sticky behavior
}

const DataTable = <T extends Record<string, any>>({ 
  data, 
  columns, 
  title, 
  icon: Icon,
  actions,
  searchPlaceholder = "Search...",
  initialPageSize = 10,
  maxHeight
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter(item => {
      // Check all sortable or accessable fields
      return columns.some(col => {
        const val = col.accessor ? col.accessor(item) : item[col.key];
        return String(val).toLowerCase().includes(lowerTerm);
      });
    });
  }, [data, searchTerm, columns]);

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const col = columns.find(c => c.key === sortConfig.key);
      const valA = col?.accessor ? col.accessor(a) : a[sortConfig.key];
      const valB = col?.accessor ? col.accessor(b) : b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handlers
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when search/filter changes
  useMemo(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(1);
      }
  }, [totalPages, currentPage]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm flex flex-col overflow-hidden transition-colors">
      
      {/* Header Toolbar */}
      <div className="p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
           {Icon && <Icon className="text-blue-500" size={20} />}
           {title && <h3 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h3>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           {/* Search */}
           <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                 type="text"
                 placeholder={searchPlaceholder}
                 value={searchTerm}
                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                 className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-400"
              />
           </div>
           
           {/* Custom Actions (e.g. Add Button) */}
           {actions}
        </div>
      </div>

      {/* Table Area - Scrollable Container for Sticky Header */}
      <div 
        className="overflow-auto custom-scrollbar"
        style={{ maxHeight: maxHeight || '65vh' }}
      >
        <table className="w-full text-left text-sm relative border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs sticky top-0 z-10 shadow-sm ring-1 ring-slate-200 dark:ring-white/5">
            <tr>
              {columns.map(col => {
                const isSortable = col.sortable !== false; // Default to true
                return (
                  <th 
                    key={col.key} 
                    className={`p-4 whitespace-nowrap transition-colors bg-slate-50 dark:bg-slate-800 ${isSortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200' : ''} ${col.headerClassName || ''}`}
                    onClick={() => isSortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {isSortable && (
                        <span className="text-slate-400">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : (
                            <ArrowUpDown size={12} className="opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    {columns.map(col => (
                    <td key={col.key} className={`p-4 ${col.className || ''}`}>
                        {col.render ? col.render(row) : row[col.key as keyof T]}
                    </td>
                    ))}
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length} className="p-12 text-center text-slate-400">
                        No results found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative">
         
         <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows per page:</span>
            <select 
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
            >
               <option value={5}>5</option>
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
            </select>
            <span className="hidden sm:inline-block ml-2">
               Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
            </span>
         </div>

         <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
                Page {currentPage} of {totalPages || 1}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <ChevronsRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default DataTable;