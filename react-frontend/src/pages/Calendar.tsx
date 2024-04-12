import React, { useState } from "react";
import axios from "axios";


import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CalendarForm from "../components/CalendarForm";

import  useCalendar  from "../hooks/useCalendar";

const Calendar = () => {
  const { createCalendar } = useCalendar();

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  
  const openCalendarModal = () => setIsCalendarModalOpen(true);
  const closeCalendarModal = () => setIsCalendarModalOpen(false);

 
 
  return (
    <div>
      <Sidebar onScheduleMeetingClick={openCalendarModal}/>
      <Navbar />
      <div className="pt-20 pl-64"> {/* Adjust this if Navbar/Sidebar dimensions change */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Calendars</h2>
          <div>
            {/* Search and other UI components */}
          </div>
          <button onClick={openCalendarModal} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Create New Calendar
          </button>
          {isCalendarModalOpen && (
            <CalendarForm 
              closeModal={closeCalendarModal}
              createCalendar={createCalendar}
            />
          )}
          {/* Here you would list the calendars and have other UI */}
        </div>
      </div>
    </div>
  );
};

export default Calendar;