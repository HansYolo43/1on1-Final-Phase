import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import { AvailableTime } from "../types";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [availables, setAvailables] = useState<AvailableTime[]>([]);

  const refresh = localStorage.getItem("refresh");

  const formatDateTime = (dateTime: string) =>
    dayjs(dateTime).format("MMMM D, YYYY h:mm A");

  useEffect(() => {
    const loadAvailables = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/calendars/availability/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
            },
          }
        );
        setAvailables(response.data); // Assuming the data is in the format that matches your state
      } catch (error) {
        try {
          const refreshment = await fetch(
            "http://127.0.0.1:8000/user/token/refresh/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh }),
            }
          );

          const data = await refreshment.json();

          if (!refreshment.ok) {
            throw new Error(data.message || "Failed to refresh.");
          }

          localStorage.setItem("token", data.access);

          const response = await axios.get(
            `http://127.0.0.1:8000/calendars/availability/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setAvailables(response.data);
        } catch (error) {
          console.log("Failed to update contact");
        }
      }
    };
    loadAvailables();
  }, []);

  const deactivateAvailability = async (id: number) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/calendars/availability/${id}/`,
        {
          preference_level: 1, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // Update local state to reflect the change
        setAvailables((prevAvailables) =>
          prevAvailables.map((avail) =>
            avail.id === id ? { ...avail, isActive: false } : avail
          )
        );
        toast.success("Availability deactivated successfully");
      }
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const ActivateAvailability = async (id: number) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/calendars/availability/${id}/`,
        {
          preference_level: 0, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // Update local state to reflect the change
        setAvailables((prevAvailables) =>
          prevAvailables.map((avail) =>
            avail.id === id ? { ...avail, isActive: false } : avail
          )
        );
        toast.success("Availability deactivated successfully");
      }
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <div className="bg-gray-900 h-screen">
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-28 px-72 flex justify-start space-x-4">
        {" "}
        {/* Adjust padding and space as needed */}
        {/* Dashboard Intro */}
        <div className="flex-grow min-w-0">
          {" "}
          {/* flex-grow allows this div to take up available space */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
            <div className="p-5 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">Hello!</h3>
              <p className="text-blue-500">
                Welcome to your dashboard. This area will serve as the main hub
                for your personalized content and quick links.
              </p>
            </div>
          </div>
          {/* Upcoming Events */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Upcoming Events
            </h2>
            <div className="p-5 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Events
              </h3>
              <p className="text-blue-500">
                Here you'll find your upcoming events...
              </p>
              {/* Upcoming events content would go here */}
              {/* <UpcomingEvents events={eventsData} /> */}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Your Availabilities
            </h2>
            
            {availables.length > 0 ? (
              
                <ul className="space-y-2">
                {availables.map((avail) => (
                    <div className="p-5 rounded-lg border border-gray-700 mt-4 bg-gray-800">
                    <li key={avail.id} className="text-white flex items-center">
                      <div className="flex-1">
                        <strong>Start:</strong>{" "}
                        {formatDateTime(avail.start_time)},
                        <br />
                        <strong> End:</strong> {formatDateTime(avail.end_time)}
                      </div>
                      {avail.preference_level === 0 && (
                        <button
                          onClick={() => deactivateAvailability(avail.id)}
                          className="text-red-500 hover:text-red-700  font-bold py-2 px-4 rounded "
                          // Disable button if availability is already inactive
                        >InActive
                        </button>
                      )}
                      {avail.preference_level === 1 && (
                        <button
                          onClick={() => ActivateAvailability(avail.id)}
                          className="text-green-500 hover:text-green-700  font-bold py-2 px-4 rounded "
                          // Disable button if availability is already inactive
                        >Active
                        </button>
                      )}
                    </li>
                    </div>
                  ))}
                </ul>
              
              ) : (
                <p className="text-white">No available times found.</p>
              )}
            
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
