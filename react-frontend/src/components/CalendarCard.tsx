// src/components/CalendarCard.tsx
import React from 'react';
import { Calendar } from '../types';

interface CalendarCardProps {
    calendar: Calendar;
  onDelete: (calendarId: number) => void;
}


const CalendarCard: React.FC<CalendarCardProps> = ({ calendar, onDelete }) => {
  return (
    <div className="calendar-card bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{calendar.name}</h3>
          <p className="text-gray-400">Description: {calendar.description}</p>
          <p className="text-gray-400">Start Date: {calendar.start_date}</p>
          <p className="text-gray-400">End Date: {calendar.end_date}</p>
        </div>
        <button onClick={() => onDelete(calendar.id)} className="text-red-400 hover:text-red-300">
          Delete
        </button>
      </div>
    </div>
  );
};

export default CalendarCard;
