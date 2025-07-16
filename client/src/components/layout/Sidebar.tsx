// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import contractsIcon from '@/assets/icons/contractsIcon.svg?react';
import claimsIcon   from '@/assets/icons/claimsIcon.svg?react';
import leadsIcon    from '@/assets/icons/leadsIcon.svg?react';
import productIcon  from '@/assets/icons/productsIcon.svg?react';
import analyticsIcon from '@/assets/icons/analyticsIcon.svg?react';
import customizeIcon from '@/assets/icons/customizeIcon.svg?react';
import settingIcon   from '@/assets/icons/settingIcon.svg?react';

interface NavItem {
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const mainNav: NavItem[] = [
  { to: '/merchant/contracts', icon: contractsIcon, text: 'Contracts' },
{ to: '/merchant/claims',   icon: claimsIcon,   text: 'Claims' },
  { to: '/merchant/leads',    icon: leadsIcon,    text: 'Leads' },
  { to: '/merchant/products', icon: productIcon,  text: 'Products' },
  // { to: '/merchant/analytics',icon: analyticsIcon,text: 'Analytics' },
  // { to: '/merchant/customize',icon: customizeIcon,text: 'Customize' },
  { to: '/merchant/settings', icon: settingIcon,  text: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay (only on mobile when Sidebar is open) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="tw-fixed tw-inset-0 tw-z-30 tw-bg-black tw-bg-opacity-30 tw-backdrop-blur-sm lg:tw-hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <motion.div
        className={`
          tw-fixed tw-top-[4rem] tw-left-0 tw-z-40 tw-h-[calc(100vh-4rem)] tw-w-64
          tw-bg-[#121212] tw-flex tw-flex-col tw-transform tw-transition-transform
          tw-duration-300 tw-ease-in-out
          ${isOpen ? 'tw-translate-x-0' : '-tw-translate-x-full lg:tw-translate-x-0'}
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={toggleSidebar}
          className="tw-absolute tw-top-4 tw-right-4 tw-z-50 tw-p-1 tw-text-gray-400 tw-rounded-md hover:tw-bg-gray-800 lg:tw-hidden"
        >
          <X size={20} />
        </button>

        {/* NAVIGATION LINKS */}
        <nav className="tw-flex-1 tw-flex tw-flex-col tw-py-4">
          {mainNav.map(({ to, icon: Icon, text }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `tw-relative tw-flex tw-items-center tw-mx-3 tw-mb-1 tw-px-4 tw-py-3 tw-rounded-md tw-transition-colors ${
                  isActive
                    ? 'tw-bg-[#0abde3] tw-text-black'
                    : 'tw-text-gray-400 hover:tw-bg-gray-800 hover:tw-text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="tw-absolute tw-top-1/2 -tw-translate-y-1/2 tw-left-0 tw-h-5/6 tw-w-2 tw-bg-black tw-rounded-md" />
                  )}
                  <Icon
                    className={`tw-w-5 tw-h-5 tw-mr-3 ${
                      isActive ? 'tw-text-[#202020]' : 'tw-text-[#88929F]'
                    }`}
                  />
                  <span
                    className={`tw-font-semibold ${
                      isActive ? 'tw-text-[#202020]' : 'tw-text-gray-400'
                    }`}
                  >
                    {text}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
