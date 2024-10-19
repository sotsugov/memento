'use client';

import { useState, useEffect, useCallback } from 'react';
import { parse, isBefore, addDays } from 'date-fns';
import ReminderForm from '@/components/reminder-form';
import ReminderList from '@/components/reminder-list';
import { Reminder } from './api/reminder';
import { createClient } from '@/lib/supabase/client';
import ErrorAlert from '@/components/error-alert';
import LoadingSpinner from '@/components/loading-spinner';

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const MAX_REMINDERS = 10;

  const fetchReminders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to fetch reminders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleClearAll = useCallback(async () => {
    setError(null);
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .not('id', 'is', null);
      if (error) throw error;
      await fetchReminders();
    } catch (err) {
      console.error('Error clearing all reminders:', err);
      setError('Failed to clear all reminders. Please try again.');
    }
  }, [fetchReminders, supabase]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      console.log('Checking reminders at:', now.toLocaleString());

      reminders.forEach((reminder) => {
        const [hours, minutes] = reminder.time.split(':');
        let reminderDate = parse(
          `${reminder.day} ${reminder.time}`,
          'EEEE HH:mm',
          now,
        );
        reminderDate.setHours(parseInt(hours));
        reminderDate.setMinutes(parseInt(minutes));

        // Adjust the reminder date to be within the current week
        while (isBefore(reminderDate, now)) {
          reminderDate = addDays(reminderDate, 1);
        }

        console.log(
          `Reminder "${reminder.message}" scheduled for:`,
          reminderDate.toLocaleString(),
        );

        // Check if the reminder is due within the next 30 seconds
        const oneMinuteFromNow = new Date(now.getTime() + 30000);
        if (
          isBefore(reminderDate, oneMinuteFromNow) &&
          !isBefore(reminderDate, now)
        ) {
          console.log('Triggering reminder:', reminder.message);
          // Trigger both browser notification and window alert
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification(reminder.message);
              }
            });
          }
          window.alert(`Reminder: ${reminder.message}`);
        }
      });
    };

    // Check reminders every 1/2 minute
    const intervalId = setInterval(checkReminders, 30000);

    // Initial check
    checkReminders();

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [reminders]);

  const handleSubmit = useCallback(
    async (data: Omit<Reminder, 'id' | 'created_at'>) => {
      setError(null);
      try {
        const { error } = await supabase.from('reminders').insert([data]);
        if (error) throw error;
        await fetchReminders();
      } catch (err) {
        console.error('Error creating reminder:', err);
        setError('Failed to create reminder. Please try again.');
      }
    },
    [fetchReminders, supabase],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setError(null);
      try {
        const { error } = await supabase
          .from('reminders')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchReminders();
      } catch (err) {
        console.error('Error deleting reminder:', err);
        setError('Failed to delete reminder. Please try again.');
      }
    },
    [fetchReminders, supabase],
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl py-12">
      <h1 className="text-2xl font-bold mb-4">Recurring Reminders</h1>
      <ReminderForm
        onSubmit={handleSubmit}
        reminderCount={reminders.length}
        maxReminders={MAX_REMINDERS}
      />
      {error && <ErrorAlert message={error} />}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ReminderList
          reminders={reminders}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
}
