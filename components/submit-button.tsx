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
          ? 'bg-slate-400 cursor-not-allowed'
          : 'bg-slate-600 hover:bg-slate-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500`}
    >
      {isLoading ? 'Creating...' : 'Create Reminder'}
    </button>
  );
}
