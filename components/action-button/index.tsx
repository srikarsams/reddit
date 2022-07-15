import React from 'react';

export function ActionButton({
  children,
  negativeMargin = false,
}: {
  children: React.ReactNode;
  negativeMargin?: boolean;
}) {
  return (
    <div
      className={`mr-1 flex cursor-pointer items-center rounded p-1 px-2 text-gray-500 hover:bg-gray-200 ${
        negativeMargin ? '-ml-2' : ''
      }`}
    >
      {children}
    </div>
  );
}
