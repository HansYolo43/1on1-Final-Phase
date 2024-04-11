import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Calendar: React.FC = () => {
    return (
      <div>
      <Sidebar/>
      <Navbar/>
        <h1>Calendar</h1>
      </div>
  );
};

export default Calendar;