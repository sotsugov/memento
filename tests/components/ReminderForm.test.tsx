import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReminderForm from '@/components/reminder-form';

jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Monday'),
  addMinutes: jest.fn((date) => date),
}));

describe('ReminderForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    reminderCount: 0,
    maxReminders: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<ReminderForm {...defaultProps} />);

    expect(screen.getByLabelText(/Reminder Message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Day of the Week/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Reminder/i }),
    ).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    render(<ReminderForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Reminder Message/i), {
      target: { value: 'Test reminder' },
    });
    fireEvent.change(screen.getByLabelText(/Day of the Week/i), {
      target: { value: 'Tuesday' },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: '14:30' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Reminder/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        message: 'Test reminder',
        day: 'Tuesday',
        time: '14:30',
      });
    });
  });

  it('disables submit button when message is empty', () => {
    render(<ReminderForm {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /Create Reminder/i }),
    ).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Reminder Message/i), {
      target: { value: 'Test' },
    });

    expect(
      screen.getByRole('button', { name: /Create Reminder/i }),
    ).not.toBeDisabled();
  });

  it('shows error message when maximum reminders are reached', () => {
    render(
      <ReminderForm {...defaultProps} reminderCount={5} maxReminders={5} />,
    );

    expect(
      screen.getByText(/Maximum limit of 5 reminders reached/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Reminder/i }),
    ).toBeDisabled();
  });

  it('updates character count as user types', async () => {
    render(<ReminderForm {...defaultProps} />);

    const input = screen.getByLabelText(/Reminder Message/i);
    fireEvent.change(input, { target: { value: 'Test message' } });

    await waitFor(() => {
      expect(screen.getByText('12/250 characters')).toBeInTheDocument();
    });
  });

  it('shows error message when message exceeds 250 characters', async () => {
    render(<ReminderForm {...defaultProps} />);

    const input = screen.getByLabelText(/Reminder Message/i);
    fireEvent.change(input, { target: { value: 'a'.repeat(250) } });

    await waitFor(() => {
      expect(screen.getByText('250/250 characters')).toBeInTheDocument();
    });
  });
});
