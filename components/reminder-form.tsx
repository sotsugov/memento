import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { format, addMinutes } from 'date-fns';
import { Reminder } from '@/app/api/reminder';
import SubmitButton from './submit-button';

interface ReminderFormProps {
  onSubmit: (data: Omit<Reminder, 'id' | 'created_at'>) => Promise<void>;
}

export default function ReminderForm({ onSubmit }: ReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, control } =
    useForm<Omit<Reminder, 'id' | 'created_at'>>();

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

  const onSubmitForm = async (data: Omit<Reminder, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // Reset to new default values after successful submission
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
    'block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 w-fit';

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="message" className="block font-medium">
          Reminder Message
        </label>
        <input
          type="text"
          id="message"
          {...register('message', { required: true, maxLength: 250 })}
          placeholder="Memento this"
          className={inputClasses}
          maxLength={250}
        />
        <p className="text-sm text-gray-500 mt-1">
          {message.length}/250 characters
        </p>
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
          />
        </div>
      </div>
      <SubmitButton isLoading={isSubmitting} />
    </form>
  );
}
