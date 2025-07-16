import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Active' | 'Deactivated' | 'Pending';
};

type FilterItem = {
  field: 'First Name' | 'Last Name' | 'Email';
  value: string;
};

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

const dummyUsers: User[] = [
  { id: '1', firstName: 'Aarav', lastName: 'Mehra', email: 'aarav.mehra@gmail.com', status: 'Active' },
  { id: '2', firstName: 'Riya', lastName: 'Sharma', email: 'riya.sharma@gmail.com', status: 'Active' },
  { id: '3', firstName: 'Kunal', lastName: 'Kunal', email: 'kunal.verma@gmail.com', status: 'Deactivated' },
  { id: '4', firstName: 'Sneha', lastName: 'Pillai', email: 'sneha.pillai@gmail.com', status: 'Pending' },
];

const Users: React.FC = () => {
  const [users] = useState<User[]>(dummyUsers);
  const [searchBy, setSearchBy] = useState<FilterItem['field']>('First Name');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addFilter = () => {
    const term = searchTerm.trim();
    if (!term) return;
    setAppliedFilters(f => [...f, { field: searchBy, value: term }]);
    setSearchTerm('');
  };
  const removeFilter = (i: number) =>
    setAppliedFilters(f => f.filter((_, idx) => idx !== i));

  const filtered = users
    .filter(u =>
      appliedFilters.every(({ field, value }) => {
        const v =
          field === 'First Name' ? u.firstName :
          field === 'Last Name'  ? u.lastName :
                                  u.email;
        return v.toLowerCase().includes(value.toLowerCase());
      })
    )
    .filter(u => {
      if (!debouncedSearchTerm) return true;
      const liveVal =
        searchBy === 'First Name' ? u.firstName :
        searchBy === 'Last Name'  ? u.lastName :
                                    u.email;
      return liveVal.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });

  const total = filtered.length;
  const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
  const from = total ? page * rowsPerPage + 1 : 0;
  const to = Math.min((page + 1) * rowsPerPage, total);
  const pageSlice = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item      = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={container}
      className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="tw-flex tw-justify-between tw-items-center">
        <div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Users</h1>
          <p className="tw-text-[#BBBBBB]">Manage your users</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-duration-700"
        >
          Add New User
        </button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={item} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4">
        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-space-x-3 tw-space-y-3 sm:tw-space-y-0">
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value as any)}
            className="tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none"
          >
            <option>First Name</option>
            <option>Last Name</option>
            <option>Email</option>
          </select>
          <div className="tw-flex tw-flex-1 tw-space-x-3">
            <div className="tw-relative tw-flex-1">
              <Search className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500" />
              <input
                type="text"
                placeholder="Enter search term…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addFilter()}
                className="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-placeholder-gray-500 focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-sm"
              />
            </div>
            <button
              onClick={addFilter}
              className="tw-flex tw-items-center tw-space-x-1 tw-bg-cyan-400 hover:tw-bg-cyan-500 tw-text-gray-900 tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm"
            >
              <Search size={16} />
              <span>Filter Users</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filter Chips */}
      {appliedFilters.length > 0 && (
        <motion.div variants={item} className="tw-flex tw-flex-wrap tw-space-x-2 tw-space-y-2 tw-px-6">
          {appliedFilters.map((f, i) => (
            <div
              key={i}
              className="tw-bg-gray-700 tw-text-gray-100 tw-py-1 tw-px-3 tw-rounded-full tw-flex tw-items-center tw-space-x-1 tw-text-sm"
            >
              <span>{f.field}: <strong>{f.value}</strong></span>
              <X size={12} className="tw-cursor-pointer" onClick={() => removeFilter(i)} />
            </div>
          ))}
        </motion.div>
      )}

      {/* Table */}
      <motion.div variants={item} className="tw-bg-[#202020] tw-rounded-lg tw-border tw-border-[#4b4b4b]">
        <div className="tw-overflow-x-auto tw-w-full tw-p-6 tw-min-w-0">
          <table className="tw-w-full tw-table-auto tw-divide-y tw-divide-[#4b4b4b]">
            <thead>
              <tr>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white uppercase">First Name</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white uppercase">Last Name</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white uppercase">Email</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white uppercase">Status</th>
                <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white"><Search size={16} /></th>
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-[#4b4b4b]">
              {pageSlice.map(u => (
                <tr key={u.id} className="tw-hover:tw-bg-[#4b4b4b] tw-transition-all tw-duration-200">
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{u.firstName}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{u.lastName}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{u.email}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm">
                    <span className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded-full ${
                      u.status === 'Active'       ? 'tw-bg-green-900 tw-text-green-300'
                      : u.status === 'Deactivated'? 'tw-bg-red-900 tw-text-red-300'
                      :                             'tw-bg-yellow-900 tw-text-yellow-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-cyan-400">
                    <Link to={`/merchant/user/${u.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total === 0 && (
            <div className="tw-py-8 tw-text-center tw-text-gray-500">No users found.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-border-t tw-border-gray-800">
          <div className="tw-flex tw-items-center tw-space-x-2">
            <span className="tw-text-[#A79C9C] tw-text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              className="tw-bg-[#202020] tw-border tw-border-[#505050] tw-text-[#A79C9C] tw-text-sm tw-rounded-md tw-py-1 tw-pl-2 tw-pr-6"
            >
              {[4, 8, 12].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="tw-flex tw-items-center tw-space-x-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="tw-p-1 disabled:tw-opacity-50"
            >
              <ChevronLeft size={20} className="tw-text-[#A79C9C]" />
            </button>
            <span className="tw-text-[#A79C9C] tw-text-sm">{from}–{to} of {total}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, maxPage))}
              disabled={page === maxPage}
              className="tw-p-1 disabled:tw-opacity-50"
            >
              <ChevronRight size={20} className="tw-text-[#A79C9C]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="tw-bg-[#202020] tw-rounded-lg tw-w-full sm:tw-w-96 tw-p-6 tw-space-y-4"
          >
            <h2 className="tw-text-xl tw-font-semibold tw-text-white">Invite a new user</h2>
            <p className="tw-text-[#BBBBBB]">Add a new user to your protḗgā account.</p>
            <div className="tw-space-y-3">
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-100">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-100">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-100">Email</label>
                <input
                  type="email"
                  placeholder="johndoe123@gmail.com"
                  className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-100">Roles</label>
                <select
                  className="tw-w-full tw-mt-1 tw-px-3 tw-py-2 tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded focus:tw-outline-none"
                >
                  <option>Select Role</option>
                  <option>All</option>
                  <option>Admin</option>
                  <option>Transaction Manager</option>
                  <option>Claims Manager</option>
                </select>
              </div>
            </div>
            <div className="tw-flex tw-justify-end tw-space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="tw-px-4 tw-py-2 tw-text-[#A79C9C] tw-rounded hover:tw-bg-gray-700 tw-duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="tw-px-4 tw-py-2 tw-bg-cyan-400 tw-text-[#202020] tw-rounded hover:tw-bg-cyan-500 tw-duration-200"
              >
                Add User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Users;
