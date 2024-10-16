import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full size-5 border-b-2 border-gray-900"></div>
    </div>
  );
}
