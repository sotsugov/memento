'use client';

import { useState, useEffect, useCallback } from 'react';
import { parse, isSameDay, isBefore } from 'date-fns';
import { Reminder } from '@/api/reminder';
import ReminderForm from '@/components/reminder-form';
import ReminderList from '@/components/reminder-list';

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = useCallback(async () => {
    const res = await fetch('/api/reminders');
    const data = await res.json();
    setReminders(data);
  }, []);

  useEffect(() => {
    fetchReminders();

    function checkReminders() {
      const now = new Date();
      reminders.forEach((reminder) => {
        const [hours, minutes] = reminder.time.split(':');
        const reminderDate = parse(
          `${reminder.day} ${reminder.time}`,
          'EEEE HH:mm',
          new Date(),
        );
        reminderDate.setHours(parseInt(hours));
        reminderDate.setMinutes(parseInt(minutes));

        if (isSameDay(now, reminderDate) && isBefore(reminderDate, now)) {
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification(reminder.message);
              }
            });
          } else {
            alert(reminder.message);
          }
        }
      });
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  const handleSubmit = useCallback(
    async (data: Reminder) => {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchReminders();
      }
    },
    [fetchReminders],
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recurring Reminders</h1>
      <ReminderForm onSubmit={handleSubmit} />
      <ReminderList reminders={reminders} />
    </div>
  );
}
