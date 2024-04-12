import React, { useState } from 'react';
import Modal from './Modal'; // Assuming Modal is in the same directory
import toast from 'react-hot-toast';

// If Modal is not in the same directory, adjust the import accordingly
// import Modal from 'path-to-your-Modal-component';

type CalendarPayload = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
};

interface CalendarFormProps {
    closeModal: () => void;
    createCalendar: (payload: CalendarPayload) => Promise<void>;
}

const CalendarForm: React.FC<CalendarFormProps> = ({closeModal, createCalendar}) => {
//   const [isOpen, setIsOpen] = useState(truefa);
  const [calendarName, setCalendarName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // const openModal = () => setIsOpen(true);
    // const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast
      .promise(createCalendar({ name: calendarName, description, start_date: startDate, end_date: endDate }), {
        loading: "Creating Calendar...",
        success: (data) => {
          return "Calendar created successfully!";
        },
        error: (error) => {
          console.error("Unable to create calendar:", error);
          return error.toString();
        },
      })
    .then(() => closeModal());
  };
    

  return (
    <div>
    <Modal
        isOpen={true}
        onChange={closeModal}
        title="Create New Calendar"
        description="Enter the details for the new calendar"
        onClose={closeModal}
    >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="calendarName" className="font-medium">
              Calendar Name
            </label>
            <input
              type="text"
              id="calendarName"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
              className="p-2 rounded-md bg-neutral-700 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded-md bg-neutral-700 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="startDate" className="font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded-md bg-neutral-700 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="endDate" className="font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded-md bg-neutral-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Create Calendar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarForm;
