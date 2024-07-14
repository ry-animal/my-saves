import React from 'react';

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({ children, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
      {React.Children.map(children, (child) => (
        <div className="w-full">{child}</div>
      ))}
    </div>
  );
};

export default GridLayout;
