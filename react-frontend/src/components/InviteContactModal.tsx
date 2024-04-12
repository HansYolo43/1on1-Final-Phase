import * as Dialog from '@radix-ui/react-dialog';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Contact } from '../types/index';
import axios from 'axios';

interface InviteContactModalProps {
    isOpen: boolean;
    calendarId: number | null;
    onClose: () => void;
  }

  const InviteContactModal: React.FC<InviteContactModalProps> = ({ isOpen, calendarId, onClose }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>('');
    const refresh = localStorage.getItem("refresh");
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
              const response = await axios.get('http://127.0.0.1:8000/user/contacts/', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
                },
              });
              setContacts(response.data);
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
      
                const response = await axios.get('http://127.0.0.1:8000/user/contacts/', {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if your token structure is different
                  },
                });
                setContacts(response.data);
              } catch (error) {
                setError('Failed to fetch contacts');
              }
            }
          };

        fetchContacts();
    }, []);

    const handleInvite = async () => {
        if (calendarId === null) {
            console.error('Calendar fetch failed');
            return;
          }

        if (!selectedContact) {
            console.error('No contact selected');
            return;
        }
        
        try {
          const response = await axios.post(`http://127.0.0.1:8000/calendars/${calendarId}/invite/`, [{
            contact: Number(selectedContact),
            calendar: calendarId
          }], {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('Invite Sent Successfully:', response.data);
          onClose();
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
      
                const response = await axios.post(`http://127.0.0.1:8000/calendars/${calendarId}/invite/`, [{
                    contact: Number(selectedContact),
                    calendar: calendarId
                  }], {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  console.log('Invite Sent Successfully:', response.data);
                  onClose();
              } catch (error) {
                console.error('Failed to send invite:', error);
              }
        }
      };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Trigger asChild>{/* Button in the parent component */}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                <Dialog.Content className="fixed p-4 bg-white rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Dialog.Title className="text-lg leading-6 font-medium text-gray-900 mb-4">Invite Contact to Calendar</Dialog.Title>
                    <Dialog.Description className="block w-full p-2 mb-4 border text-black">
                        Select a contact to invite:   
                        <select value={selectedContact} onChange={(e) => setSelectedContact(e.target.value)}>
                            <option value="" className="block w-full p-2 mb-4 border text-grey">Select a contact</option>
                            {contacts.map(contact => (
                                <option key={contact.id} value={contact.id}>{contact.username}</option>
                            ))}
                        </select>
                    </Dialog.Description>
                    {/* <button onClick={handleInvite}>Invite</button> */}
                    <button onClick={handleInvite} type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Invite
                    </button>
                    <button onClick={onClose} type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                        Close
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default InviteContactModal;
