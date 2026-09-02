import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-pink-100 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
