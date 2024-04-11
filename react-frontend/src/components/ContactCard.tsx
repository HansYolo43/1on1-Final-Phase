// src/components/ContactCard.tsx
import React from 'react';
import { Contact } from '../types';

interface ContactCardProps {
  contact: Contact;
  onDelete: (contactId: number) => void;
}


const ContactCard: React.FC<ContactCardProps> = ({ contact, onDelete }) => {
  return (
    <div className="contact-card bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{contact.username}</h3>
          <p className="text-gray-400">{contact.email}</p>
        </div>
        <button onClick={() => onDelete(contact.id)} className="text-red-400 hover:text-red-300">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
