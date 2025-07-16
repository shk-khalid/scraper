import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMerchantContext } from '@/context/MerchantContext';


function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function formatToIST(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

type FilterItem = {
  field: 'Contract ID' | 'Claim ID' | 'Customer Name';
  value: string;
};

const ClaimsPage: React.FC = () => {
  const { claims, isLoading } = useMerchantContext();

  const [searchBy, setSearchBy] = useState<FilterItem['field']>('Contract ID');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  useEffect(() => { setPage(0); }, [appliedFilters, rowsPerPage]);

  const addFilter = () => {
    const term = searchTerm.trim();
    if (!term) return;
    setAppliedFilters(f => [...f, { field: searchBy, value: term }]);
    setSearchTerm('');
  };
  const removeFilter = (idx: number) => {
    setAppliedFilters(f => f.filter((_, i) => i !== idx));
  };

  // filtering logic
  const filtered = claims
    .filter(c =>
      appliedFilters.every(({ field, value }) => {
        const v = field === 'Contract ID'
          ? c.contractId
          : field === 'Claim ID'
            ? c.claimId
            : c.customerName;
        return v.toLowerCase().includes(value.toLowerCase());
      })
    )
    .filter(c => {
      if (!debouncedSearchTerm) return true;
      const liveVal = searchBy === 'Contract ID'
        ? c.contractId
        : searchBy === 'Claim ID'
          ? c.claimId
          : c.customerName;
      return liveVal.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });

  // pagination
  const total = filtered.length;
  const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
  const from = total ? page * rowsPerPage + 1 : 0;
  const to = Math.min((page + 1) * rowsPerPage, total);
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  if (isLoading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-w-12 tw-h-12 tw-border-t-4 tw-border-cyan-400 tw-border-solid tw-rounded-full tw-animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-2 tw-items-center tw-gap-4">
        <div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Claims</h1>
          <p className="tw-text-[#BBBBBB]">Review and process claims</p>
        </div>
        <div className="tw-flex tw-justify-end">
          {/* <button className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-duration-700">
            File a Claim
          </button> */}
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4">
        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center tw-space-y-3 sm:tw-space-y-0 sm:tw-space-x-3">
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value as FilterItem['field'])}
            className="tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none"
          >
            <option>Contract ID</option>
            <option>Claim ID</option>
            <option>Customer Name</option>
          </select>
          <div className="tw-flex tw-flex-1 tw-space-x-3">
            <div className="tw-relative tw-flex-1">
              <Search className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500" />
              <input
                type="text"
                placeholder="Search …"
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
              <span>Filter Claims</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filter Chips */}
      {appliedFilters.length > 0 && (
        <motion.div variants={itemVariants} className="tw-flex tw-flex-wrap tw-space-x-2 tw-space-y-2 tw-px-6">
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

      {/* Table & Pagination */}
      <motion.div variants={itemVariants} className="tw-bg-[#202020] tw-rounded-lg tw-border tw-border-[#4b4b4b]">
        <div className="tw-overflow-x-auto tw-w-full tw-p-6 tw-min-w-0">
          <table className="tw-w-full tw-table-auto tw-divide-y tw-divide-[#4b4b4b]">
            <thead>
              <tr>
                {['Type', 'Contract ID', 'Claim ID', 'Customer Name', 'Customer Email', 'Failure Type', 'Incident Date', 'Status', ''].map(h => (
                  <th
                    key={h}
                    className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-white uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-[#4b4b4b]">
              {paginated.map(c => (
                <tr key={c.claimId} className="tw-transition-all tw-duration-200 hover:tw-bg-[#4b4b4b]">
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.type}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.contractId}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.claimId}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.customerName}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.customerEmail}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{c.failureType}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-[#BBBBBB]">{formatToIST(c.incidentDate)}</td>
                  <td className="tw-px-4 tw-py-3 tw-text-sm">
                    <span className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded-full ${
                        c.status === 'Approved'
                          ? 'tw-bg-green-900 tw-text-green-300'
                          : c.status === 'Denied'
                          ? 'tw-bg-red-900 tw-text-red-300'
                          : 'tw-bg-yellow-900 tw-text-yellow-300'
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="tw-px-4 tw-py-3 tw-text-cyan-400">
                    <Link to={c.claimId}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total === 0 && (
            <div className="tw-py-8 tw-text-center tw-text-gray-500">No claims found.</div>
          )}
        </div>
        <div className="tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-border-t tw-border-gray-800">
          <div className="tw-flex tw-items-center tw-space-x-2">
            <span className="tw-text-[#A79C9C] tw-text-sm">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              className="tw-bg-[#202020] tw-border tw-border-[#505050] tw-text-[#A79C9C] tw-text-sm tw-rounded-md tw-py-1 tw-pl-2 tw-pr-6"
            >
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="tw-flex tw-items-center tw-space-x-2">
            <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} className="tw-p-1 disabled:tw-opacity-50">
              <ChevronLeft size={20} className="tw-text-[#A79C9C]" />
            </button>
            <span className="tw-text-[#A79C9C] tw-text-sm">{from} – {to} of {total}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, maxPage))} disabled={page === maxPage} className="tw-p-1 disabled:tw-opacity-50">
              <ChevronRight size={20} className="tw-text-[#A79C9C]" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimsPage;
