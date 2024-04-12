import { useState } from "react";
import axios from 'axios';
import { useToken } from './useToken';
import { access } from "fs";


interface CalendarState {
  calendars: any[]; 
  createCalendar: (payload: CalendarPayload) => Promise<void>;
  fetchCalendars: () => Promise<void>;
  sendInvite: (calendarId: number, payload: InvitePayload) => Promise<void>;
  error: string | null;
}

// Define the payload interfaces outside the hook
interface CalendarPayload {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface InvitePayload {
  username: string;
  email: string;
}

const useCalendar = () => {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = () => localStorage.getItem("token");
  const { refreshToken } = useToken();

  // const handleApiResponse = (response: any) => {
  //   console.log("API response:", response.data);
  //   return response.data;
  // };

  // const handleApiError = (error: any) => {
  //   const errorMsg = error.response?.data?.message || error.message;
  //   setError(errorMsg);
  //   console.error("API error:", errorMsg);
  //   return null;
  // };

  // const getAccessToken = async () => {
  //   try {
  //     const newAccessToken = await refreshToken(); // Wait for refreshToken to complete
  //     return newAccessToken;
  //   } catch (error) {
  //     setError('Unable to refresh access token.');
  //     throw new Error(String(error)); // Explicitly cast error to string
  //   }
  // };

  const createCalendar = async (payload: CalendarPayload) => {

    const accessToken =  getAccessToken();

    try {
      const response = await axios.post('http://127.0.0.1:8000/calendars/calendars/', payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // setCalendars(prev => [...prev, response.data]);
     
    } catch (error) {
      
    }
  };

  const fetchCalendars = async () => {
    const accessToken = await getAccessToken();

    try {
      const response = await axios.get('http://127.0.0.1:8000/calendars/calendars/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // setCalendars(response.data);
      // return handleApiResponse(response);
      return response.data;
    } catch (error) {
      // return handleApiError(error);
    }
  };

  const sendInvite = async (calendarId: number, payload: InvitePayload) => {

    const accessToken = await getAccessToken();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/calendars/${calendarId}/invite/`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    } catch (error) {
 
      
    }
  };

  return { calendars, createCalendar, fetchCalendars, sendInvite, error };
};

export default useCalendar;

