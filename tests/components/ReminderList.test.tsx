import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReminderList from '@/components/reminder-list';

// Mock the MementoBell component to count it
jest.mock('@/components/reminder-icon', () => () => (
  <div data-testid="memento-bell" />
));

describe('ReminderList', () => {
  const mockReminders = [
    { id: 1, message: 'Reminder 1', day: 'Monday', time: '09:00' },
    { id: 2, message: 'Reminder 2', day: 'Tuesday', time: '14:00' },
  ];

  const mockOnDelete = jest.fn(() => Promise.resolve());
  const mockOnClearAll = jest.fn(() => Promise.resolve());

  const defaultProps = {
    reminders: mockReminders,
    onDelete: mockOnDelete,
    onClearAll: mockOnClearAll,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of reminders', () => {
    render(<ReminderList {...defaultProps} />);

    expect(screen.getByText(/Current Reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 1/)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 2/)).toBeInTheDocument();
    expect(screen.getAllByTestId('memento-bell')).toHaveLength(2);
  });

  it('shows "No reminders" message when the list is empty', () => {
    render(<ReminderList {...defaultProps} reminders={[]} />);

    expect(screen.getByText(/No reminders set/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(<ReminderList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Remove');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    });
  });

  it('disables delete button while deleting', async () => {
    render(<ReminderList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Remove');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteButtons[0]).toBeDisabled();
      expect(deleteButtons[0]).toHaveTextContent('...');
    });

    await waitFor(() => {
      expect(deleteButtons[0]).not.toBeDisabled();
      expect(deleteButtons[0]).toHaveTextContent('Remove');
    });
  });

  it('calls onClearAll when clear all button is clicked', async () => {
    render(<ReminderList {...defaultProps} />);

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    await waitFor(() => {
      expect(mockOnClearAll).toHaveBeenCalled();
    });
  });

  it('disables clear all button while clearing', async () => {
    render(<ReminderList {...defaultProps} />);

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    await waitFor(() => {
      expect(clearAllButton).toBeDisabled();
      expect(clearAllButton).toHaveTextContent('...');
    });

    await waitFor(() => {
      expect(clearAllButton).not.toBeDisabled();
      expect(clearAllButton).toHaveTextContent('Clear All');
    });
  });

  it('truncates long reminder messages', () => {
    const longMessage =
      'This is a very long reminder message that should be truncated';
    const remindersWithLongMessage = [
      { ...mockReminders[0], message: longMessage },
    ];

    render(
      <ReminderList {...defaultProps} reminders={remindersWithLongMessage} />,
    );

    expect(
      screen.getByText(/This is a very long reminder message that.../),
    ).toBeInTheDocument();
  });

  it('does not show clear all button when there are no reminders', () => {
    render(<ReminderList {...defaultProps} reminders={[]} />);

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });
});
