import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { format, addMinutes } from 'date-fns';
import { Reminder } from '@/app/api/reminder';
import SubmitButton from './submit-button';

interface ReminderFormProps {
  onSubmit: (data: Omit<Reminder, 'id' | 'created_at'>) => Promise<void>;
  reminderCount: number;
  maxReminders: number;
}

export default function ReminderForm({
  onSubmit,
  reminderCount,
  maxReminders,
}: ReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Omit<Reminder, 'id' | 'created_at'>>();

  const setDefaultValues = useCallback(() => {
    const now = new Date();
    const nextMinute = addMinutes(now, 2);
    const currentDay = format(now, 'EEEE');
    const currentTime = format(nextMinute, 'HH:mm');
    setValue('day', currentDay);
    setValue('time', currentTime);
  }, [setValue]);

  useEffect(() => {
    setDefaultValues();
  }, [setDefaultValues]);

  const isLimitReached = reminderCount >= maxReminders;

  const onSubmitForm = async (data: Omit<Reminder, 'id' | 'created_at'>) => {
    if (isLimitReached) return;
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setDefaultValues();
    } finally {
      setIsSubmitting(false);
    }
  };

  const message = useWatch({
    control,
    name: 'message',
    defaultValue: '',
  });

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const inputClasses =
    'block max-w-sm rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:leading-6 w-fit';

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="message-container">
        <label htmlFor="message" className="block font-medium">
          Reminder Message
        </label>
        <input
          type="text"
          id="message"
          {...register('message', {
            required: 'Message is required',
            maxLength: 250,
          })}
          placeholder="Memento this"
          className={inputClasses}
          maxLength={250}
          disabled={isLimitReached}
        />
        <div className="message-info">
          <p className="text-sm text-gray-500 mt-1">
            {message.length}/250 characters
          </p>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-x-6">
        <div>
          <label htmlFor="day" className="block font-medium">
            Day of the Week
          </label>
          <select
            id="day"
            {...register('day', { required: true })}
            className={inputClasses}
            disabled={isLimitReached}
          >
            {weekdays.map((weekday) => (
              <option key={weekday} value={weekday} className="block px-4 py-2">
                {weekday}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="time" className="block font-medium">
            Time
          </label>
          <input
            type="time"
            id="time"
            {...register('time', { required: true })}
            className={inputClasses}
            disabled={isLimitReached}
          />
        </div>
      </div>
      {isLimitReached && (
        <p className="text-red-500">
          Maximum limit of {maxReminders} reminders reached. Please delete some
          reminders to add more.
        </p>
      )}
      <SubmitButton
        isLoading={isSubmitting}
        disabled={isLimitReached || !message.trim()}
      />
    </form>
  );
}
