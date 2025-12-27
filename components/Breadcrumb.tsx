import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="#" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-600" />
              <span className={`ml-1 text-sm font-medium md:ml-2 ${index === items.length - 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}>
                {item}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;