import React from 'react';

interface GridDebugProps {
  children: React.ReactNode;
  className?: string;
}

const GridDebug: React.FC<GridDebugProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`grid gap-8 ${className}`}
      style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        // Fallback responsive grid
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)'
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: 'repeat(3, 1fr)'
        }
      }}
    >
      {children}
    </div>
  );
};

export default GridDebug;