import React, { useState } from "react";
import Modal from "./Modal"; // Assuming Modal is in the same directory
import toast from "react-hot-toast";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import axios from "axios";




interface AvailiblityModalProps {
  closeModal: () => void;
}

const AvailiblityModal: React.FC<AvailiblityModalProps> = ({ closeModal }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [timeRange, setTimeRange] = useState<DateRange<Dayjs>>([dayjs(), dayjs().add(1, 'hour')]);
  const handleSubmit = async () => {
    // Format start and end datetimes by combining the selected date with the time range
    if (!selectedDate || !timeRange[0] || !timeRange[1]) {
      toast.error('Please ensure all date and time selections are complete.');
      return;
    }
  
    // Prepare the payload from your state
    const availabilityPayload = {
      start_time: selectedDate.hour(timeRange[0].hour()).minute(timeRange[0].minute()).toISOString(),
      end_time: selectedDate.hour(timeRange[1].hour()).minute(timeRange[1].minute()).toISOString(),
      preference_level: 0
    };

    
    try {
      const response = await axios.post('http://127.0.0.1:8000/calendars/availability/', availabilityPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Availability created successfully');
      closeModal();
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 401) {
        // Handle token refresh
        try {
          const availabilityPayload = {
            start_time: selectedDate.hour(timeRange[0].hour()).minute(timeRange[0].minute()).toISOString(),
            end_time: selectedDate.hour(timeRange[1].hour()).minute(timeRange[1].minute()).toISOString(),
            preference_level: 0
          };

          const retryResponse = await axios.post('http://127.0.0.1:8000/calendars/availability/', availabilityPayload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          toast.success('Availability created successfully');
          closeModal();
        } catch (refreshError) {
          toast.error('Session expired. Please log in again.');
        }
      } else {
        const errorMessage = (error as Error).message;
        toast.error('Failed to create availability: ' + errorMessage);
      }
    }
  };
  

  return (
    <Modal
      isOpen={true}
      onChange={closeModal}
      title="Create Availability"
      description="Enter the start and end time for your availability"
      onClose={closeModal}
    >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-4">

          <DateCalendar value={selectedDate} onChange={setSelectedDate} defaultValue={dayjs('2024-04-12')} />
          <div className="center-align w-full">
          <SingleInputTimeRangeField label="Preferred Time" value={timeRange} onChange={setTimeRange}defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]} className="w-full" />
          </div>
            <button onClick={handleSubmit} className="w-full p-2 bg-blue-500 text-white rounded-md">
            Create Availability
          </button>
        
        </div>
        </LocalizationProvider>
    </Modal>
  );
};

export default AvailiblityModal;
