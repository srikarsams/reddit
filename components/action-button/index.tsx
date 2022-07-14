import React from 'react';

export function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-1 flex cursor-pointer items-center rounded p-1 px-2 text-gray-500 hover:bg-gray-200">
      {children}
    </div>
  );
}
