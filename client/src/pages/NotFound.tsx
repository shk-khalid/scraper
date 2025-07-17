import React, { useEffect } from 'react';
import NotFoundIcon from '@/assets/NotFound.svg?react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found';
    return () => {
      document.title = document.querySelector('[data-default]')?.getAttribute('title') || 'Vite + React + TS';
    };
  }, []);

  return (
    <div className="tw-min-h-screen tw-bg-black tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-animate-fadeIn">
      <div className="tw-flex tw-flex-col tw-items-center tw-max-w-md tw-px-4 tw-text-center">
        <NotFoundIcon className="tw-text-gray-400 tw-mb-6" />
        <h1 className="tw-text-4xl tw-font-bold tw-mb-4">Page Not Found</h1>
        <p className="tw-mb-8 tw-text-gray-300">
          The page you are looking for doesn't exist or has been moved
        </p>
        <Link
          to="/"
          className="tw-font-semibold tw-py-3 tw-px-8 tw-rounded-full tw-transition-colors tw-duration-700 tw-bg-[#00C5FB] tw-text-black tw-text-sm sm:tw-text-base  hover:tw-bg-white hover:tw-text-cyan-600
  "
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;