import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Contacts from './pages/Contacts';
import Events from './pages/Events';
import Settings from './pages/Setting';

const App: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white">
      <Router>
      <Navbar />
        <Sidebar />
        <Routes>
          {/* Add routes here */}
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
