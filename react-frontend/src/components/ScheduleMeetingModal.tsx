import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const refresh = localStorage.getItem("refresh");

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Construct the payload for the POST request
    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate
    };
    
    try {
        // Replace with your actual endpoint
        const endpoint = 'http://127.0.0.1:8000/calendars/calendars/';

        const response = await axios.post(endpoint, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
              // Include other headers such as authorization if required
            },
        });

        console.log('Response:', response.data);
        onClose(); // Close the modal on successful submission
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

          const endpoint = 'http://127.0.0.1:8000/calendars/calendars/';

          const response = await axios.post(endpoint, payload, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
                // Include other headers such as authorization if required
              },
          });
  
          console.log('Response:', response.data);
          onClose(); // Close the modal on successful submission
        } catch (error) {
            console.error('Error creating calendar:', error);
        }
      }
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Schedule a Meeting</h3>

          <input 
            type="text" 
            name="name"
            placeholder="Calendar Name" 
            value={formData.name}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border text-black"
            required
          />

          <input 
            type="text" 
            name="description"
            placeholder="Description" 
            value={formData.description}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border text-black"
            required
          />

          <input 
            type="date" 
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border text-black"
            required
          />

          <input 
            type="date" 
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border text-black"
            required
          />

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Calendar
          </button>
          <button onClick={onClose} type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};


export default ScheduleMeetingModal;
