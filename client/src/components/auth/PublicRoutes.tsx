import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const PublicRoute: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
        <Loader className="tw-h-8 tw-w-8 tw-animate-spin tw-text-indigo-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={'/merchant/contracts'} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;