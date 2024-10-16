import { Reminder } from '@/api/reminder';
import React from 'react';
import { useForm } from 'react-hook-form';

interface ReminderFormProps {
  onSubmit: (data: Reminder) => void;
}

export default function ReminderForm({ onSubmit }: ReminderFormProps) {
  const { register, handleSubmit } = useForm<Reminder>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Reminder Message
        </label>
        <input
          type="text"
          id="message"
          {...register('message', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="day"
          className="block text-sm font-medium text-gray-700"
        >
          Day of the Week
        </label>
        <select
          id="day"
          {...register('day', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700"
        >
          Time
        </label>
        <input
          type="time"
          id="time"
          {...register('time', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Reminder
      </button>
    </form>
  );
}
