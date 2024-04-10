import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  return (
    <div>
    <Sidebar/>
    <Navbar/>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;