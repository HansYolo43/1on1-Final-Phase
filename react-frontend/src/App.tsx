import React from 'react';

import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Contacts from './pages/Contacts';
import Events from './pages/Events';
import Settings from './pages/Setting';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';




const App: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white">
      <Router>
        <Routes>
          {/* Add routes here */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
