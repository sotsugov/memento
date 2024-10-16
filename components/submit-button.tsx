import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export default function SubmitButton({
  isLoading,
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
        isLoading || disabled
          ? 'bg-indigo-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {isLoading ? 'Creating...' : 'Create Reminder'}
    </button>
  );
}
