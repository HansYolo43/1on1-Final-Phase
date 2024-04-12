import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';
import AvailiblityModal from '../components/AvailiblityModal';
// import UpcomingEvents from "../components/UpcomingEvents";
// import MiniCalendar from "../components/MiniCalendar";
// import ActivityFeed from "../components/ActivityFeed";

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-900 h-screen">
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-28 px-72 flex justify-start space-x-4"> {/* Adjust padding and space as needed */}
        {/* Dashboard Intro */}
        <div className="flex-grow min-w-0"> {/* flex-grow allows this div to take up available space */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
            <div className="p-5 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">Hello!</h3>
              <p className="text-blue-500">Welcome to your dashboard. This area will serve as the main hub for your personalized content and quick links.</p>
            </div>
          </div>
          {/* Upcoming Events */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Upcoming Events</h2>
            <div className="p-5 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Events</h3>
              <p className="text-blue-500">Here you'll find your upcoming events...</p>
              {/* Upcoming events content would go here */}
              {/* <UpcomingEvents events={eventsData} /> */}
            </div>
          </div>
        </div>
        {/* Activity Feed */}
        {/* Uncomment and include your activity feed component when it's ready */}
        {/* <div className="flex-grow min-w-0">
          <h2 className="text-2xl font-semibold text-white mb-6">Activity Feed</h2>
          <ActivityFeed activities={activityData} />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;