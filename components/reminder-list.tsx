import { Reminder } from '@/api/reminder';
import React from 'react';

interface ReminderListProps {
  reminders: Reminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Current Reminders</h2>
      <ul className="space-y-2">
        {reminders.map((reminder) => (
          <li key={reminder._id} className="bg-gray-100 p-2 rounded">
            {reminder.message} - Every {reminder.day} at {reminder.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
