// src/components/ContactFormModal.tsx
import React, { useState, useEffect } from 'react';
import { addContact } from '../types';


interface ContactFormModalProps {
  contact?: addContact; // Make it optional for adding new contacts
  onSave: (contact: addContact) => void;
  onClose: () => void;
}


const ContactFormModal: React.FC<ContactFormModalProps> = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // Add other contact fields as necessary
  });

  useEffect(() => {
    // If there's a contact prop, it's an edit modal
    if (contact) {
      setFormData({
        username: contact.username,
        email: contact.email,
        // Set other fields from the contact data
      });
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // Close the modal after saving
  };

  return (
    <div className="modal bg-gray-600 bg-opacity-50 fixed inset-0">
      <div className="modal-content relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <label htmlFor="name">Name:</label> */}
          <input
            className="px-4 py-2 rounded-md text-black"
            type="text"
            placeholder="User Name"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* <label htmlFor="email">Email:</label> */}
          <input
            className="px-4 py-2 rounded-md text-black"
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Add other input fields as needed */}

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold block w-full rounded-md">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold block w-full rounded-md">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
