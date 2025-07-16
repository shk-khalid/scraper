// src/components/TopBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Users, LifeBuoy, UserCircle, LogOut, Settings } from 'lucide-react';
import DesktopIcon from '@/assets/desktopLogo.png';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onHamburgerClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onHamburgerClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('You have been logged out. See you soon!');
    } catch (err: any) {
      console.error('Logout failed:', err);
      toast.error('Logout failed: ' + (err.message ?? 'Unknown error'));
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-16 tw-bg-[#121212] tw-flex tw-items-center tw-z-50 tw-px-4">
      {/* LEFT: Hamburger (mobile) + Logo */}
      <div className="tw-flex tw-items-center tw-h-full">
        <button
          onClick={onHamburgerClick}
          className="lg:tw-hidden tw-text-gray-400 hover:tw-bg-gray-800 tw-p-2 tw-rounded-md"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <img
          src={DesktopIcon}
          alt="Protega Logo"
          className="tw-h-14 md:tw-h-full"
        />
      </div>

      {/* RIGHT: Nav items + Avatar */}
      <div className="tw-flex tw-items-center tw-ml-auto tw-space-x-4 lg:tw-space-x-8 tw-pr-2">
        <NavItem icon={<Users size={18} />} text="Users" link="/merchant/user" />
        {/* <NavItem icon={<LifeBuoy size={18} />} text="Support" link="#" /> */}

        {/* USER AVATAR + DROPDOWN */}
        <div className="tw-relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="tw-flex tw-items-center tw-space-x-2 focus:tw-outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-gray-700 tw-flex tw-items-center tw-justify-center">
              <UserCircle size={20} className="tw-text-gray-400" />
            </div>
            <span className="tw-text-sm tw-text-gray-300 tw-hidden lg:tw-inline">
              {user?.email}
            </span>
          </button>

          {dropdownOpen && (
            <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-48 tw-bg-[#1F1F1F] tw-border tw-border-gray-700 tw-rounded-md tw-shadow-lg tw-z-50 tw-overflow-hidden">
              {/* <a
                href="/profile"
                className="tw-flex tw-items-center tw-space-x-2 tw-px-4 tw-py-2 tw-text-gray-300 hover:tw-bg-gray-800"
              >
                <Settings size={16} />
                <span className="tw-text-sm">Profile</span>
              </a> */}
              <button
                onClick={handleLogout}
                className="tw-w-full tw-flex tw-items-center tw-space-x-2 tw-px-4 tw-py-2 tw-text-gray-300 hover:tw-bg-gray-800"
              >
                <LogOut size={16} />
                <span className="tw-text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, link }) => (
  <Link
    to={link}
    className="tw-flex tw-items-center tw-text-gray-300 hover:tw-text-white tw-transition-colors tw-duration-200"
  >
    <span className="tw-mr-0 lg:tw-mr-2">{icon}</span>
    <span className="tw-text-sm tw-hidden lg:tw-inline">{text}</span>
  </Link>
);

export default TopBar;
