import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
      {/* Sidebar content goes here */}
    </aside>
  );
};

export default Sidebar;
