import { Reminder } from '@/app/api/reminder';
import React, { useState } from 'react';
import MementoBell from './reminder-icon';

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

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Current Reminders</h2>
        {reminders.length > 0 && (
          <button onClick={handleClearAll} disabled={isClearingAll}>
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
              <div className="flex flex-row gap-x-2 items-center">
                <MementoBell />
                <span>
                  {truncateMessage(reminder.message)}
                  {' • '}
                  <span className="text-sm opacity-50">
                    Every {reminder.day} at {reminder.time}
                  </span>
                </span>
              </div>
              <button
                onClick={() => reminder.id && handleDelete(reminder.id)}
                disabled={deletingId === reminder.id}
                aria-label="Delete reminder"
              >
                {deletingId === reminder.id ? '...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
