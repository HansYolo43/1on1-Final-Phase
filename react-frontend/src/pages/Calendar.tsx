import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';
import InviteContactModal from '../components/InviteContactModal';



import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Calendar } from '../types/index';
import CalendarCard from '../components/CalendarCard'; // You'll need to create this component


const Calendars: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvitelOpen, setIsInvitelOpen] = useState(false);


  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const refresh = localStorage.getItem("refresh");
  const [error, setError] = useState('');
  const [activeCalendarId, setActiveCalendarId] = useState<number | null>(null);


  useEffect(() => {
    // Fetch contacts when the component mounts
    const fetchCalendars = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/calendars/calendars/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
          },
        });
        setCalendars(response.data);
      } catch (error) {
        try {
          const refreshment = await fetch("http://127.0.0.1:8000/user/token/refresh/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
          });
      
          const data = await refreshment.json();
      
          if (!refreshment.ok) {
            throw new Error(
              data.message ||
                "Failed to refresh."
            );
          }

          localStorage.setItem("token", data.access); // Store token

          const response = await axios.get('http://127.0.0.1:8000/calendars/calendars/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
            },
          });
          setCalendars(response.data);
        } catch (error) {
          setError('Failed to fetch calendars');
        }
      }
    };

    fetchCalendars();
  }, [localStorage.getItem("token")]);

  const deleteCalendar = async (calendarId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/calendars/calendars/${calendarId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCalendars(currentCalendars => currentCalendars.filter(calendar => calendar.id !== calendarId));
    } catch (error) {
      try {
        const refreshment = await fetch("http://127.0.0.1:8000/user/token/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });
    
        const data = await refreshment.json();
    
        if (!refreshment.ok) {
          throw new Error(
            data.message ||
              "Failed to refresh."
          );
        }

        localStorage.setItem("token", data.access); // Store token
        
        await axios.delete(`http://127.0.0.1:8000/calendars/calendars/${calendarId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCalendars(currentCalendars => currentCalendars.filter(calendar => calendar.id !== calendarId));
      } catch (error) {
        setError('Failed to delete calendar');
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openInviteModal = () => setIsInvitelOpen(true);
  const closeInviteModal = () => setIsInvitelOpen(false);

  const handleInviteClick = (calendarId: number) => {
    setActiveCalendarId(calendarId);
    setIsInvitelOpen(true);
  };

    return (
      <>
      <Navbar />
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />
      <InviteContactModal isOpen={isInvitelOpen} onClose={closeInviteModal} calendarId={activeCalendarId}/>
      <div className="pt-20 pl-64"> {/* Adjust this if Navbar/Sidebar dimensions change */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Calendars</h2>
          {/* Calendar list */}
          <div className="mt-4">
            {calendars.map((calendar) => (
              <CalendarCard
                key={calendar.id}
                calendar={calendar}
                onInviteClick={() => handleInviteClick(calendar.id)}
                onDelete={() => deleteCalendar(calendar.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendars;