import type { TableHTMLAttributes, ReactNode } from 'react';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-pink-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className={`min-w-full text-left text-sm ${className}`} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export default Table;
