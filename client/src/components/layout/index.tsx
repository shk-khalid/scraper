// src/components/Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="tw-min-h-screen tw-bg-[#202020] tw-flex tw-flex-col">
      {/* Pass toggleSidebar so TopBar can show hamburger */}
      <TopBar onHamburgerClick={toggleSidebar} />

      {/* 2) Below TopBar: Sidebar + Main Content */}
      <div className="tw-flex tw-flex-1 tw-mt-16">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="tw-flex-1 tw-min-w-0 lg:tw-ml-64 tw-transition-all tw-duration-700">
          <motion.main
            className="tw-relative tw-p-4 md:tw-p-6 lg:tw-p-8 tw-min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tw-max-w-7xl tw-mx-auto">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
