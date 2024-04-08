import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css'; // Assuming you have an App.css for global styles

const App: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white">
      <Navbar />
      <Sidebar />
    </div>
  );
};

export default App;
