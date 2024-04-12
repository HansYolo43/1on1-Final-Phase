import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';

const Calendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    return (
      <div>
      <Sidebar onScheduleMeetingClick={openModal} />
  
      <Navbar/>
        <h1>Dashboard</h1>
      </div>
  );
};

export default Calendar;