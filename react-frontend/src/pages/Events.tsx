import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import { Calendar, Invite } from "../types";
import axios from "axios";
import toast from "react-hot-toast";
import { access } from "fs";

const Events: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const refresh = localStorage.getItem("refresh");
  const access = localStorage.getItem("token");
  const [selectedCalendarId, setSelectedCalendarId] = useState< number>(
  );

  const [invitations, setInvitations] = useState<Invite[]>([]);

  const handleCalendarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCalendarId(Number(e.target.value));
  };

  //fetch all calendars using t
  useEffect(() => {
    // Fetch contacts when the component mounts
    const fetchCalendars = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/calendars/calendars/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
            },
          }
        );
        setCalendars(response.data);
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

          localStorage.setItem("token", data.access); // Store token

          const response = await axios.get(
            "http://127.0.0.1:8000/calendars/calendars/",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
              },
            }
          );
          setCalendars(response.data);
        } catch (error) {
          toast.error("Failed to fetch calendars");
        }
      }
    };

    fetchCalendars();

    
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    if (selectedCalendarId && access) {
      // Fetch invitations when selectedCalendarId changes
      const fetchInvitations = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/calendars/${selectedCalendarId}/invitations/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setInvitations(response.data); // Assuming the data is in the format that matches your state
        }catch (error: any) {
          toast.error("Failed to fetch invitations", error.message);
        }
      };

      fetchInvitations();
    }
  }, [selectedCalendarId]);

  return (
    <div className="bg-gray-900 h-screen">
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-28 px-72 flex justify-start space-x-4">
        <div className="flex-grow min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Events</h2>
            <div className="p-5 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Invitations
              </h3>
              <p className="text-blue-500">
                All your Invitations sent will be displayed here.
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Choose A Calendar
            </h3>
            <select
              value={selectedCalendarId}
              onChange={handleCalendarChange}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="">Select a calendar</option>
              {calendars.map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Invitation Sent
            </h2>
            {invitations.length > 0 ? (
              <ul className="space-y-2">
                {invitations.map((invite) => (
                   <div className="p-5 rounded-lg border border-gray-700 mt-4 bg-gray-800">
                  <li
                    key={invite.id}
                    className="text-white flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <strong>Contact:</strong> {invite.contact}
                      <br />
                      </div>
                      {invite.has_responded === false && (
                        <div>
                          <button className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded">
                            Pending
                          </button>
                        </div>
                      )}
                    {invite.response === true  && (
                        <div>
                          <button className="text-green-500 hover:text-green-700  font-bold py-2 px-4 rounded ">
                            Accepted
                          </button>
                        </div>
                      )}
                      {invite.response === false  && (
                        <div>
                          <button className="text-red-500 hover:text-red-700  font-bold py-2 px-4 rounded ">
                            Accepted
                          </button>
                        </div>
                      )}
                        
                        


                    </li>
                  </div>
                  
                ))}
              </ul>
            ) : (
              <p className="text-white">No invitations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
