import { Reminder } from '@/app/api/reminder';
import React, { useState } from 'react';

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: number) => Promise<void>;
  onClearAll: () => Promise<void>;
}

export default function ReminderList({
  reminders,
  onDelete,
  onClearAll,
}: ReminderListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setIsClearingAll(true);
    try {
      await onClearAll();
    } finally {
      setIsClearingAll(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Current Reminders</h2>
        {reminders.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isClearingAll}
            className="text-red-600 hover:text-red-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearingAll ? '...' : 'Clear All'}
          </button>
        )}
      </div>
      {reminders.length === 0 ? (
        <p className="opacity-50">
          No reminders set. Add a reminder to get started!
        </p>
      ) : (
        <ul className="space-y-2">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="bg-gray-100 dark:bg-gray-500/20 p-2 rounded flex justify-between items-center"
            >
              <span>
                {reminder.message}
                {' • '}
                <span className="text-sm opacity-50">
                  Every {reminder.day} at {reminder.time}
                </span>
              </span>
              <button
                onClick={() => reminder.id && handleDelete(reminder.id)}
                disabled={deletingId === reminder.id}
                className={`mr-2 text-red-600 hover:text-red-800 focus:outline-none ${
                  deletingId === reminder.id
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                aria-label="Delete reminder"
              >
                {deletingId === reminder.id ? '...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
