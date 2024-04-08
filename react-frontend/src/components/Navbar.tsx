import React, { useState } from 'react';
import logo from '../images/logo.svg';
import userProfileImage from '../images/profile.jpg';
import { format } from 'date-fns';

const Navbar: React.FC = () => {

  //States for the current date
    const [currentDate, setCurrentDate] = useState(new Date());

    // Handler to move to the next day
    const handleNextDay = () => {
      setCurrentDate((prevDate) => {
        const nextDay = new Date(prevDate);
        nextDay.setDate(prevDate.getDate() + 1);
        return nextDay;
      });
    };
  
    // Handler to move to the previous day
    const handlePrevDay = () => {
      setCurrentDate((prevDate) => {
        const prevDay = new Date(prevDate);
        prevDay.setDate(prevDate.getDate() - 1);
        return prevDay;
      });
    };
  
    // Handler to reset to today's date
    const handleToday = () => {
      setCurrentDate(new Date());
    };



    return (
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        <div className="flex items-center">

          <img src={logo} alt="1on1Calendar" className="h-10 mr-3" />
          <span className="text-xl font-semibold">1on1Calendar</span>
        </div>
        <div className="flex items-center">
          <button className="text-blue-400 mr-4" onClick={handleToday}>Today</button>
          <button className="mr-2" onClick={handlePrevDay}>‹</button>
          <button className="mr-4" onClick={handleNextDay}>›</button>
          <span className="mr-4">{format(currentDate, 'MMMM d, yyyy')}</span>
          <input
            type="search"
            placeholder="Search"
            className="px-4 py-2 rounded-md bg-gray-700 mr-4"
          />
          <button>
            {/* Replace "UserProfileImagePath" with the actual path */}
            <img src={userProfileImage} alt="Profile" className="w-8 h-8 rounded-full" />
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;