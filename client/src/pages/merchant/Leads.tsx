import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import CustomizeLeadPage from '@/pages/merchant/CustomizeLeads';
import CreateLeadModal from '@/components/leads/CreateLeadsModal';

interface Lead {
    id: string;
    transactionId: string;
    transactionDate: string;
    customerName: string;
    customerEmail: string;
    productName: string;
    quantity: number;
    lineItemPrice: number;
    status: 'Active' | 'Inactive' | 'Pending';
}

type FilterItem = {
    field: 'Transaction ID' | 'Customer Name' | 'Product Name';
    value: string;
};

// Debounce Hook
function useDebounce<T>(value: T, delay = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const mockLeads: Lead[] = [
    {
        id: '1',
        transactionId: 'TRN123458',
        transactionDate: '02 May 2024',
        customerName: 'John Doe',
        customerEmail: 'john.doe@gmail.com',
        productName: 'Smart Speaker',
        quantity: 1,
        lineItemPrice: 14500,
        status: 'Active'
    },
    {
        id: '2',
        transactionId: 'TRN123459',
        transactionDate: '15 Apr 2024',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@gmail.com',
        productName: 'Air Purifier',
        quantity: 2,
        lineItemPrice: 18999,
        status: 'Active'
    },
    {
        id: '3',
        transactionId: 'TRN123460',
        transactionDate: '10 Mar 2024',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@gmail.com',
        productName: 'Wireless Earbuds',
        quantity: 1,
        lineItemPrice: 7999,
        status: 'Inactive'
    },
    {
        id: '4',
        transactionId: 'TRN123461',
        transactionDate: '22 Feb 2024',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@gmail.com',
        productName: 'Smartwatch',
        quantity: 1,
        lineItemPrice: 15000,
        status: 'Pending'
    }
];

const Leads: React.FC = () => {
    // Tab state (if you still need Email Management tab)
    const [currentTab, setCurrentTab] = useState<'search' | 'email'>('search');

    // Search/filter state
    const [searchBy, setSearchBy] = useState<'Transaction ID' | 'Customer Name' | 'Product Name'>('Transaction ID');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal + leads state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [leads, setLeads] = useState<Lead[]>(mockLeads);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [appliedFilters]);

    const addFilter = () => {
        const term = searchTerm.trim();
        if (!term) return;
        setAppliedFilters((prev) => [
            ...prev,
            { field: searchBy, value: term },
        ]);
        setSearchTerm('');
    };

    const removeFilter = (index: number) => {
        setAppliedFilters((prev) => prev.filter((_, i) => i !== index));
    };

    // Filter leads by appliedFilters and live search
    const filteredLeads = leads
        .filter((lead) =>
            appliedFilters.every(({ field, value }) => {
                let fieldValue = '';
                if (field === 'Transaction ID') fieldValue = lead.transactionId;
                else if (field === 'Customer Name') fieldValue = lead.customerName;
                else if (field === 'Product Name') fieldValue = lead.productName;
                return fieldValue.toLowerCase().includes(value.toLowerCase());
            })
        )
        .filter((lead) => {
            if (!debouncedSearchTerm) return true;
            let liveFieldValue = '';
            if (searchBy === 'Transaction ID') liveFieldValue = lead.transactionId;
            else if (searchBy === 'Customer Name') liveFieldValue = lead.customerName;
            else if (searchBy === 'Product Name') liveFieldValue = lead.productName;
            return liveFieldValue.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        });

    // Pagination calculations
    const total = filteredLeads.length;
    const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
    const from = total > 0 ? page * rowsPerPage + 1 : 0;
    const to = Math.min((page + 1) * rowsPerPage, total);
    const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Framer-motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    };

    const handleCreateLead = (leadData: any) => {
        const newLead: Lead = {
            id: Date.now().toString(),
            transactionId: leadData.transactionId,
            transactionDate: leadData.transactionDate,
            customerName: leadData.customerName || 'New Customer',
            customerEmail: leadData.customerEmail || '',
            productName: leadData.productName || 'Unknown Product',
            quantity: leadData.quantity || 1,
            lineItemPrice: leadData.lineItemPrice || 0,
            status: 'Pending'
        };
        setLeads(prev => [newLead, ...prev]);
        setIsCreateModalOpen(false);
    };

    // —— Export logic —— 
    const exportLeadsToCSV = () => {
        if (filteredLeads.length === 0) {
            // Optionally alert user: no leads to export
            alert('No leads to export.');
            return;
        }
        // Define CSV headers in the order you want:
        const headers = [
            'Transaction ID',
            'Transaction Date',
            'Customer Name',
            'Customer Email',
            'Product Name',
            'Quantity',
            'Line Item Price',
            'Status',
        ];
        // Build rows: for each lead, map into array of values (escaping commas/quotes if needed)
        const escapeCSV = (value: string) => {
            // If value contains comma or quote or newline, wrap in quotes and escape quotes
            if (/[",\n]/.test(value)) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };
        const rows = filteredLeads.map((lead) => [
            escapeCSV(lead.transactionId),
            escapeCSV(lead.transactionDate),
            escapeCSV(lead.customerName),
            escapeCSV(lead.customerEmail),
            escapeCSV(lead.productName),
            lead.quantity.toString(),
            lead.lineItemPrice.toString(),
            escapeCSV(lead.status),
        ]);

        // Combine into CSV string
        let csvContent = '';
        csvContent += headers.join(',') + '\r\n';
        rows.forEach((row) => {
            csvContent += row.join(',') + '\r\n';
        });

        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Filename with timestamp
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-'); // e.g. 2025-06-10-17-00-00
        link.setAttribute('download', `leads_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6"
        >
            {/* Header + Tab Buttons */}
            <motion.div variants={itemVariants} className="tw-space-y-4">
                <div className="tw-flex tw-items-center tw-justify-start tw-space-x-4 sm:tw-justify-between sm:tw-space-x-0">
                    <div>
                        <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Leads</h1>
                        <p className="tw-text-[#BBBBBB]">Browse and manage your leads</p>
                    </div>
                    <div className="tw-flex tw-justify-end">
                        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-end sm:tw-items-center tw-space-y-2 sm:tw-space-y-0 sm:tw-space-x-2">
                            <button
                                onClick={exportLeadsToCSV}
                                className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-duration-700"
                            >
                                Export Leads
                            </button>
                        </div>
                    </div>
                </div>


                {/* Tab Navigation */}
                <div className="tw-flex tw-border-b tw-border-gray-700">
                    <button
                        onClick={() => setCurrentTab('search')}
                        className={`tw-py-2 tw-px-4 -tw-mb-px tw-border-b-2 ${currentTab === 'search'
                                ? 'tw-border-cyan-400 tw-text-cyan-400'
                                : 'tw-border-transparent tw-text-[#A79C9C] hover:tw-text-gray-100'
                            }`}
                    >
                        Leads Search
                    </button>
                    <button
                        onClick={() => setCurrentTab('email')}
                        className={`tw-py-2 tw-px-4 -tw-mb-px tw-border-b-2 ${currentTab === 'email'
                                ? 'tw-border-cyan-400 tw-text-cyan-400'
                                : 'tw-border-transparent tw-text-[#A79C9C] hover:tw-text-gray-100'
                            }`}
                    >
                        Email Management
                    </button>
                </div>
            </motion.div>

            {/* Content based on active tab */}
            {currentTab === 'search' ? (
                <>
                    {/* Search Bar + Add Filter */}
                    <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4">
                        <div className="tw-flex tw-flex-col tw-space-y-3 sm:tw-flex-row sm:tw-items-center sm:tw-space-x-3 sm:tw-space-y-0">
                            <select
                                value={searchBy}
                                onChange={(e) =>
                                    setSearchBy(e.target.value as 'Transaction ID' | 'Customer Name' | 'Product Name')
                                }
                                className="tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none sm:tw-w-auto"
                            >
                                <option>Transaction ID</option>
                                <option>Customer Name</option>
                                <option>Product Name</option>
                            </select>

                            <div className="tw-flex tw-flex-row tw-space-x-3 tw-w-full">
                                <div className="tw-relative tw-flex-1">
                                    <Search className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search …"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addFilter()}
                                        className="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-placeholder-gray-500 focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-sm"
                                    />
                                </div>
                                <button
                                    onClick={addFilter}
                                    className="tw-flex tw-items-center tw-space-x-1 tw-bg-cyan-400 hover:tw-bg-cyan-500 tw-text-gray-900 tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm"
                                >
                                    <Search size={16} />
                                    <span>Add Filter</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Applied Filters Chips */}
                    {appliedFilters.length > 0 && (
                        <motion.div variants={itemVariants} className="tw-flex tw-flex-wrap tw-space-x-2 tw-space-y-2 tw-px-6">
                            {appliedFilters.map((f, idx) => (
                                <div
                                    key={idx}
                                    className="tw-bg-gray-700 tw-text-gray-100 tw-py-1 tw-px-3 tw-rounded-full tw-flex tw-items-center tw-space-x-1 tw-text-sm"
                                >
                                    <span>
                                        {f.field}: <strong>{f.value}</strong>
                                    </span>
                                    <X
                                        size={12}
                                        className="tw-cursor-pointer"
                                        onClick={() => removeFilter(idx)}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Table + Pagination */}
                    <motion.div variants={itemVariants} className="tw-bg-[#202020] tw-rounded-lg tw-border tw-border-[#4b4b4b]">
                        <div className="tw-overflow-x-auto tw-w-full tw-p-6 tw-min-w-0">
                            <table className="tw-w-full tw-table-auto tw-divide-y tw-divide-[#4b4b4b]">
                                <thead>
                                    <tr>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Transaction Date
                                        </th>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Customer Name
                                        </th>
                                        <th className="hidden md:table-cell tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Customer Email
                                        </th>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="hidden lg:table-cell tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Line Item Price
                                        </th>
                                        <th className="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-medium tw-text-white uppercase tw-tracking-wider">
                                            Status
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="tw-divide-y tw-divide-[#4b4b4b]">
                                    {paginatedLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="tw-transition-all tw-duration-200 hover:tw-bg-[#4b4b4b]"
                                        >
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.transactionId}
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.transactionDate}
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.customerName}
                                            </td>
                                            <td className="hidden md:table-cell tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.customerEmail}
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.productName}
                                            </td>
                                            <td className="hidden lg:table-cell tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                {lead.quantity}
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center tw-text-[#BBBBBB]">
                                                ₹{lead.lineItemPrice.toLocaleString()}
                                            </td>
                                            <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-center">
                                                <span
                                                    className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded-full ${lead.status === 'Active'
                                                            ? 'tw-bg-green-900 tw-text-green-300'
                                                            : lead.status === 'Inactive'
                                                                ? 'tw-bg-red-900 tw-text-red-300'
                                                                : 'tw-bg-yellow-900 tw-text-yellow-300'
                                                        }`}
                                                >
                                                    {lead.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredLeads.length === 0 && (
                                <div className="tw-py-8 tw-text-center tw-text-gray-500">
                                    No leads found.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-border-t tw-border-gray-800">
                            {/* rows selector */}
                            <div className="tw-flex tw-items-center tw-space-x-2">
                                <span className="tw-text-[#A79C9C] tw-text-sm">
                                    Rows per page:
                                </span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setPage(0);
                                    }}
                                    className="tw-bg-[#202020] tw-border tw-border-[#505050] tw-text-[#A79C9C] tw-text-sm tw-rounded-md tw-py-1 tw-pl-2 tw-pr-6"
                                >
                                    {[5, 10, 20, 50].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* page controls */}
                            <div className="tw-flex tw-items-center tw-space-x-2">
                                <button
                                    onClick={() => setPage(p => Math.max(p - 1, 0))}
                                    disabled={page === 0}
                                    className="tw-p-1 disabled:tw-opacity-50"
                                >
                                    <ChevronLeft size={20} className="tw-text-[#A79C9C]" />
                                </button>
                                <span className="tw-text-[#A79C9C] tw-text-sm">
                                    {from} – {to} of {total}
                                </span>
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
                </>
            ) : (
                // Email Management tab content
                <motion.div variants={itemVariants} className="tw-bg-[#202020] tw-rounded-lg tw-p-6">
                    <CustomizeLeadPage />
                </motion.div>
            )}

            {/* Create Lead Modal */}
            {currentTab === 'search' && isCreateModalOpen && (
                <CreateLeadModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateLead}
                />
            )}
        </motion.div>
    );
};

export default Leads;
