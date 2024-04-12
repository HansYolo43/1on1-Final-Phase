// src/pages/Contactors.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Contact, addContact } from '../types/index';
import ContactCard from '../components/ContactCard'; // You'll need to create this component
import ContactFormModal from '../components/ContactFormModal'; // This too
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';


const Contactors = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const refresh = localStorage.getItem("refresh");
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch contacts when the component mounts
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
  }, [localStorage.getItem("token")]);

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/user/contacts/?search=${searchTerm}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setContacts(response.data);
  //   } catch (error) {
  //     try {
  //       const refreshment = await fetch("http://127.0.0.1:8000/user/token/refresh/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ refresh }),
  //       });
    
  //       const data = await refreshment.json();
    
  //       if (!refreshment.ok) {
  //         throw new Error(
  //           data.message ||
  //             "Failed to refresh."
  //         );
  //       }

  //       localStorage.setItem("token", data.access); // Store token

  //     const response = await axios.get(`http://127.0.0.1:8000/user/contacts/?search=${searchTerm}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setContacts(response.data);
  //   } catch (error) {
  //     setError('Failed to search contacts');
  //   }
  //   }
  // };

  const addContact = async (contactData: addContact) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/user/contacts/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify( contactData ),
      });
      // setContacts([...contacts, response.data]);
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

      const response = await fetch('http://127.0.0.1:8000/user/contacts/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify( contactData ),
      });
      // setContacts([...contacts, response.data]);
      } catch (error) {
        setError('Failed to add contact');
      }
    }
  };

  const updateContact = async (contactData: addContact) => {
    if (selectedContact) {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/user/contacts/${selectedContact.id}/`, contactData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContacts(contacts.map((contact) => (contact.id === selectedContact.id ? response.data : contact)));
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

        const response = await axios.put(`http://127.0.0.1:8000/user/contacts/${selectedContact.id}/`, contactData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setContacts(contacts.map((contact) => (contact.id === selectedContact.id ? response.data : contact)));
      } catch (error) {
        setError('Failed to update contact');
      }
    }
  }
  };

  const deleteContact = async (contactId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/user/contacts/${contactId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContacts(currentContacts => currentContacts.filter(contact => contact.id !== contactId));
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
        
        await axios.delete(`http://127.0.0.1:8000/user/contacts/${contactId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setContacts(currentContacts => currentContacts.filter(contact => contact.id !== contactId));
      } catch (error) {
        setError('Failed to delete contact');
      }
    }
  };

//   return (
//     <div>
//       <Sidebar/>
//       <Navbar/>
//       <h1>Contactors</h1>
//       <div>
//         <input
//           type="search"
//           placeholder="Search Contacts"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//       <div>
//         {/* Render contacts here */}
//         {contacts.map((contact) => (
//           <ContactCard key={contact.id} contact={contact} onEdit={setSelectedContact} onDelete={deleteContact} />
//         ))}
//       </div>
//       <button onClick={() => setSelectedContact(null)}>Add Contact</button>
//       {selectedContact !== null && (
//         <ContactFormModal
//           contact={selectedContact}
//           onSave={selectedContact ? updateContact : addContact}
//           onClose={() => setSelectedContact(null)}
//         />
//       )}
//     </div>
//   );
// };

  // Additional code for handling modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add modal open and close handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='bg-gray-900 h-screen"'>
      <Navbar />
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />
      <div className="pt-20 pl-64"> {/* Adjust this if Navbar/Sidebar dimensions change */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Contactors</h2>
          <div>
            {/* Search and other UI components */}
          </div>
          <button onClick={openAddModal} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Add Contact
          </button>
          {isAddModalOpen && (
            <ContactFormModal
              onSave={addContact} // Ensure this function is correctly implemented
              onClose={closeAddModal}
            />
          )}
          {/* Contact list */}
          <div className="mt-4">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={() => deleteContact(contact.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactors;
