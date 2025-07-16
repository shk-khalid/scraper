// src/pages/UserDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, X as XIcon } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

const DUMMY_USERS: Record<string, User> = {
  '1': {
    id: '1',
    firstName: 'Aarav',
    lastName: 'Mehra',
    email: 'aarav.mehra@gmail.com',
    roles: ['Claims Manager'],
  },
  // …add more if you like
};

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const userFromStore = DUMMY_USERS[id!] || {
    id: '0',
    firstName: 'Unknown',
    lastName: 'User',
    email: 'unknown@example.com',
    roles: ['—'],
  };

  // edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userFromStore.firstName);
  const [lastName, setLastName]   = useState(userFromStore.lastName);
  const [email, setEmail]         = useState(userFromStore.email);
  const [roles, setRoles]         = useState(userFromStore.roles.join(', '));

  // deactivate modal state
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const handleSave = () => {
    // Here you would typically call an API to save changes.
    console.log('Saved:', {
      firstName,
      lastName,
      email,
      roles: roles.split(',').map(r => r.trim()),
    });
    setIsEditing(false);
  };
  const handleCancelEdit = () => {
    // Revert local edits
    setFirstName(userFromStore.firstName);
    setLastName(userFromStore.lastName);
    setEmail(userFromStore.email);
    setRoles(userFromStore.roles.join(', '));
    setIsEditing(false);
  };

  const openDeactivateModal = () => setIsDeactivateOpen(true);
  const closeDeactivateModal = () => setIsDeactivateOpen(false);
  const confirmDeactivate = () => {
    alert(`User ${userFromStore.firstName} deactivated.`);
    setIsDeactivateOpen(false);
    // TODO: call your API here to deactivate the user
  };

  return (
    <div className="tw-p-6 tw-bg-[#202020] tw-min-h-screen">
      {/* Breadcrumb */}
      <div className="tw-flex tw-items-center tw-text-gray-400 tw-text-sm tw-space-x-2 tw-mb-6">
        <button
          onClick={() => nav(-1)}
          className="tw-flex tw-items-center tw-gap-1 hover:tw-text-white"
        >
          <ArrowLeft size={16} /> Users
        </button>
        <span>›</span>
        <span className="tw-text-white">
          {userFromStore.firstName} {userFromStore.lastName}
        </span>
      </div>

      {/* Header */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-gap-4 tw-mb-6">
        <h1 className="tw-text-2xl tw-font-semibold tw-text-white">
          {userFromStore.firstName} {userFromStore.lastName}
        </h1>
        <div className="tw-space-x-2">
          <button
            onClick={() => alert(`Resent invite to ${userFromStore.email}`)}
            className="tw-px-4 tw-py-2 tw-bg-[#1C1C1E] tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-[#202020] tw-duration-200"
          >
            Resend Email Invite
          </button>
          <button
            onClick={openDeactivateModal}
            className="tw-px-4 tw-py-2 tw-bg-[#1C1C1E] tw-border tw-border-red-600 tw-text-red-600 tw-rounded hover:tw-bg-red-600 hover:tw-text-white tw-duration-200"
          >
            Deactivate User
          </button>
        </div>
      </div>

      <div className="tw-border-b tw-border-[#4c4c4c] tw-mb-6" />

      {/* Details Card */}
      <div className="tw-border tw-border-[#4C4C4C] tw-rounded-lg tw-bg-[#1C1C1E] tw-p-6 tw-relative">
        {/* Edit / Save / Cancel positioned at bottom-right */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="tw-absolute tw-bottom-4 tw-right-4 tw-flex tw-items-center tw-space-x-1 tw-text-cyan-400 hover:tw-text-cyan-300 tw-text-sm"
          >
            <Pencil size={16} /> <span>Edit</span>
          </button>
        ) : (
          <div className="tw-absolute tw-bottom-4 tw-right-4 tw-flex tw-space-x-2">
            <button
              onClick={handleSave}
              className="tw-flex tw-items-center tw-space-x-1 tw-text-cyan-400 hover:tw-text-cyan-300"
            >
              <Check size={16} /> <span>Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="tw-flex tw-items-center tw-space-x-1 tw-text-red-500 hover:tw-text-red-400"
            >
              <XIcon size={16} /> <span>Cancel</span>
            </button>
          </div>
        )}

        <h2 className="tw-text-lg tw-font-medium tw-text-white tw-mb-4">User Details</h2>

        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-6 tw-text-sm">
          <div>
            <p className="tw-text-gray-400">First Name</p>
            {isEditing ? (
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
              />
            ) : (
              <p className="tw-text-white">{userFromStore.firstName}</p>
            )}
          </div>

          <div>
            <p className="tw-text-gray-400">Last Name</p>
            {isEditing ? (
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
              />
            ) : (
              <p className="tw-text-white">{userFromStore.lastName}</p>
            )}
          </div>

          <div className="sm:tw-col-span-2">
            <p className="tw-text-gray-400">Email</p>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
              />
            ) : (
              <p className="tw-text-white">{userFromStore.email}</p>
            )}
          </div>

          <div className="sm:tw-col-span-2">
            <p className="tw-text-gray-400">
              Role{userFromStore.roles.length > 1 ? 's' : ''}
            </p>
            {isEditing ? (
              <input
                type="text"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                placeholder="Comma‑separate roles"
                className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
              />
            ) : (
              <p className="tw-text-white">{userFromStore.roles.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {isDeactivateOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center z-50">
          <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-w-full sm:tw-w-96 tw-p-6 tw-space-y-4">
            <h2 className="tw-text-lg tw-font-semibold tw-text-white">Deactivate User</h2>
            <p className="tw-text-gray-300">
              This will remove the user’s access to the Merchant Portal and assigned role(s).
            </p>
            <p className="tw-text-gray-300">
              Are you sure you want to deactivate this user?
            </p>
            <div className="tw-flex tw-justify-end tw-space-x-3 tw-mt-4">
              <button
                onClick={closeDeactivateModal}
                className="tw-px-4 tw-py-2 tw-text-[#A79C9C] tw-rounded hover:tw-bg-gray-700 tw-duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="tw-px-4 tw-py-2 tw-bg-red-600 tw-text-white tw-rounded hover:tw-bg-red-700 tw-duration-200"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
