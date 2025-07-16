// src/pages/Analytics.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,          // <-- custom Tooltip import
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

// ─── Custom Dark Tooltip ─────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const breakLabel = (str: string, maxLen = 20) =>
  str.replace(new RegExp(`(.{${maxLen}})`, 'g'), '$1\n');

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="tw-bg-[#1c1c1e] tw-p-3 tw-rounded tw-border tw-border-gray-700 tw-text-white tw-text-sm tw-break-words">
      {label && (
        <div className="tw-font-medium tw-mb-1 whitespace-pre-wrap">
          {breakLabel(label)}
        </div>
      )}
      {payload.map((entry, idx) => (
        <div key={idx} className="tw-flex tw-justify-between">
          <span className="tw-capitalize">{entry.name}:</span>
          <span>
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const COLORS_PRIMARY = ['#4c6ef5', '#15aabf', '#34d399', '#f59f00', '#e03131', '#be4bdb'];
const COLORS_SECONDARY = ['#228be6', '#12b886', '#fab005', '#f03e3e', '#7950f2'];
const tabs = ['Product Protection', 'Shipping Protection'];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // ─── PRODUCT PROTECTION DUMMY DATA ────────────────────────────────────────────
  const productMetrics = {
    totalWarrantySales: 105000,
    totalWarrantySold: 6000,
    merchantRevenue: 55000,
    averageWarrantyPrice: 5000,
    averageWarrantyPct: 15.06,
    warrantyRefunded: 0,
  };
  const dataByTermLength = [
    { name: '6 months', value: 35000 },
    { name: '12 months', value: 55000 },
    { name: '24 months', value: 15000 },
  ];
  const dataByCoverage = [
    { name: 'Basic', value: 40200 },
    { name: 'Premium', value: 30000 },
  ];
  const trendedWarrantySales = [
    { date: 'Dec 20', rupees: 48000, units: 3000 },
    { date: 'Jan 13', rupees: 55000, units: 3500 },
    { date: 'Feb 19', rupees: 42000, units: 2800 },
    { date: 'Mar 21', rupees: 38000, units: 2600 },
    { date: 'Apr 18', rupees: 30000, units: 2000 },
    { date: 'May 20', rupees: 45000, units: 3200 },
  ];
  const warrantySalesByChannelAvailable = false;
  const warrantySalesByChannel = [
    { channel: 'Online', value: 70000 },
    { channel: 'Retail', value: 35000 },
  ];
  const rupeesAttachRate = 7.5;
  const unitAttachRate = 8.5;
  const attachRateByCategory = [
    { category: 'Product Category 1', rate: 18.9 },
    { category: 'Product Category 2', rate: 17.0 },
    { category: 'Product Category 3', rate: 16.0 },
    { category: 'Product Category 4', rate: 17.9 },
    { category: 'Product Category 5', rate: 8.9 },
    { category: 'Product Category 6', rate: 15.0 },
    { category: 'Product Category 7', rate: 10.9 },
  ];
  const trendedAttachRate = [
    { date: '2025-01-01', rupeeRate: 5.2, unitRate: 6.1 },
    { date: '2025-01-08', rupeeRate: 6.8, unitRate: 7.5 },
    { date: '2025-01-15', rupeeRate: 7.0, unitRate: 7.8 },
    { date: '2025-01-22', rupeeRate: 6.5, unitRate: 7.2 },
    { date: '2025-01-29', rupeeRate: 7.3, unitRate: 8.0 },
    { date: '2025-02-05', rupeeRate: 7.5, unitRate: 8.2 },
    { date: '2025-02-12', rupeeRate: 7.1, unitRate: 8.0 },
    { date: '2025-02-19', rupeeRate: 6.9, unitRate: 7.7 },
  ];
  const allClaimsByFailure = [
    { name: 'Mechanical Failure', value: 215 },
    { name: 'Electrical Failure', value: 120 },
    { name: 'Other', value: 349 },
  ];
  const approvedClaimsByFailure = [
    { name: 'Mechanical Failure', value: 205 },
    { name: 'Electrical Failure', value: 110 },
    { name: 'Other', value: 340 },
  ];

  // ─── SHIPPING PROTECTION DUMMY DATA ────────────────────────────────────────────
  const [dateFrom, setDateFrom] = useState<Date>(new Date('2025-06-20'));
  const [dateTo, setDateTo] = useState<Date>(new Date('2025-06-28'));
  const [period, setPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [attachType, setAttachType] = useState<'Unit' | 'Rupee'>('Unit');

  const shippingMetrics = {
    totalContractSales: 155000,
    totalContractsSold: 6100,
    merchantRevenue: 65000,
    averageContractPrice: 5000,
    averageOrderValuePct: 15.06,
  };
  const trendedContracts = [
    { date: '2025-06-20', sales: 48000, units: 3000 },
    { date: '2025-06-22', sales: 55000, units: 3500 },
    { date: '2025-06-24', sales: 42000, units: 2800 },
    { date: '2025-06-26', sales: 38000, units: 2600 },
    { date: '2025-06-28', sales: 45000, units: 3200 },
  ];
  const unitAttachByBand = [
    { band: '₹90,000', rate: 30.07 },
    { band: '₹60,252', rate: 30.22 },
    { band: '₹80,000', rate: 30.65 },
    { band: '₹12,603', rate: 30.80 },
    { band: '₹20,553', rate: 30.20 },
    { band: '₹10,553', rate: 29.25 },
    { band: '₹12,553', rate: 40.58 },
  ];
  const trendedAttach = [
    { date: '2025-06-20', rupee: 45, unit: 50 },
    { date: '2025-06-22', rupee: 48, unit: 52 },
    { date: '2025-06-24', rupee: 42, unit: 47 },
    { date: '2025-06-26', rupee: 39, unit: 44 },
    { date: '2025-06-28', rupee: 41, unit: 49 },
  ];
  const totalClaims = 672;
  const approvalRate = 92.56;
  const allShipClaims = [
    { name: 'Shipment Stolen', value: 188 },
    { name: 'Shipment Lost', value: 421 },
    { name: 'Shipment Damaged', value: 251 },
    { name: 'Multiple Shipments in Order', value: 44 },
  ];
  const approvedShipClaims = [
    { name: 'Shipment Stolen', value: 168 },
    { name: 'Shipment Lost', value: 402 },
    { name: 'Shipment Damaged', value: 231 },
    { name: 'Multiple Shipments in Order', value: 44 },
  ];
  // ──────────────────────────────────────────────────────────────────────────────

  return (
    <div className="tw-p-6 tw-space-y-6">
      {/* HEADER + TABS */}
      <motion.div variants={itemVariants} className="tw-space-y-4">
        <div className="tw-flex tw-items-center tw-justify-start tw-space-x-4 sm:tw-justify-between sm:tw-space-x-0">
          <div>
            <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">
              Analytics
            </h1>
            <p className="tw-text-[#BBBBBB]">
              Browse and analyze your performance data
            </p>
          </div>

        </div>


        {/* Tab Navigation */}
        <div className="tw-flex tw-border-b tw-border-gray-700">
          <button
            onClick={() => setActiveTab('Product Protection')}
            className={`tw-py-2 tw-px-4 -tw-mb-px tw-border-b-2 ${activeTab === 'Product Protection'
              ? 'tw-border-cyan-400 tw-text-cyan-400'
              : 'tw-border-transparent tw-text-[#A79C9C] hover:tw-text-gray-100'
              }`}
          >
            Product Protection
          </button>
          <button
            onClick={() => setActiveTab('Shipping Protection')}
            className={`tw-py-2 tw-px-4 -tw-mb-px tw-border-b-2 ${activeTab === 'Shipping Protection'
              ? 'tw-border-cyan-400 tw-text-cyan-400'
              : 'tw-border-transparent tw-text-[#A79C9C] hover:tw-text-gray-100'
              }`}
          >
            Shipping Protection
          </button>
        </div>
      </motion.div>

      {/* SHIPPING FILTERS */}
      {activeTab === 'Shipping Protection' && (
        <div className="tw-flex tw-items-center tw-space-x-4 tw-mb-4">
          <div>
            <div className="tw-text-xs tw-text-gray-400">Date</div>
            <div className="tw-flex tw-space-x-2">
              <DatePicker
                selected={dateFrom}
                onChange={d => d && setDateFrom(d)}
                className="tw-bg-[#1c1c1e] tw-text-white tw-p-2 tw-rounded"
                dateFormat="dd MMM yyyy"
              />
              <span className="tw-text-gray-400">—</span>
              <DatePicker
                selected={dateTo}
                onChange={d => d && setDateTo(d)}
                className="tw-bg-[#1c1c1e] tw-text-white tw-p-2 tw-rounded"
                dateFormat="dd MMM yyyy"
              />
            </div>
          </div>
          <div>
            <div className="tw-text-xs tw-text-gray-400">Period</div>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value as any)}
              className="tw-bg-[#1c1c1e] tw-text-white tw-p-2 tw-rounded"
            >
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <div className="tw-text-xs tw-text-gray-400">Attach Rates</div>
            <select
              value={attachType}
              onChange={e => setAttachType(e.target.value as any)}
              className="tw-bg-[#1c1c1e] tw-text-white tw-p-2 tw-rounded"
            >
              <option>Unit</option>
              <option>Rupee</option>
            </select>
          </div>
        </div>
      )}

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="tw-space-y-6">
        {activeTab === 'Product Protection' && (
          <>
            {/* Row 1 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
              <MetricCard label="Total Warranty Sales" value={`₹ ${productMetrics.totalWarrantySales.toLocaleString()}`} />
              <MetricCard label="Warranty Sold" value={`${productMetrics.totalWarrantySold.toLocaleString()}+`} />
              <MetricCard label="Merchant Revenue" value={`₹ ${productMetrics.merchantRevenue.toLocaleString()}`} />
            </motion.div>
            {/* Row 2 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
              <MetricCard label="Average Warranty Price" value={`₹ ${productMetrics.averageWarrantyPrice.toLocaleString()}`} />
              <MetricCard
                label="Average Warranty Price (%)"
                value={`${productMetrics.averageWarrantyPct.toFixed(2)}%`}
                subLabel="(as % of product price)"
              />
              <MetricCard label="Warranty Refunded" value={`₹ ${productMetrics.warrantyRefunded.toLocaleString()}`} />
            </motion.div>
            {/* Row 3 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              <DonutCard title="Warranty Sales (₹) by Term Length" data={dataByTermLength} colors={COLORS_PRIMARY} isCurrency />
              <DonutCard title="Warranty Sales (₹) by Coverage Type" data={dataByCoverage} colors={COLORS_SECONDARY} isCurrency />
            </motion.div>
            {/* Row 4 */}
            <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
              <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Trended Warranty Sales</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendedWarrantySales} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis yAxisId="left" orientation="left" stroke="#888" tickFormatter={v => `₹${v / 1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" tickFormatter={v => v.toString()} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" wrapperStyle={{ color: '#aaa' }} />
                  <Line yAxisId="left" type="monotone" dataKey="rupees" name="₹ Sales" stroke={COLORS_PRIMARY[0]} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="units" name="Units Sold" stroke={COLORS_PRIMARY[1]} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Row 5 */}
            <motion.div variants={itemVariants}>
              <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700 tw-text-gray-400">
                <div className="tw-text-sm tw-mb-2">Warranty Sales (₹) By Channel*</div>
                {warrantySalesByChannelAvailable ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={warrantySalesByChannel} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                      <XAxis dataKey="channel" stroke="#888" />
                      <YAxis stroke="#888" tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={COLORS_PRIMARY[2]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="tw-text-xs tw-text-gray-500">
                    *N/A indicates that channel data is not available. Contact your MSM for details.
                  </div>
                )}
              </div>
            </motion.div>
            {/* Row 6 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <MetricCard label="Rupees attach rate" value={`${rupeesAttachRate.toFixed(1)}%`} />
              <MetricCard label="Unit attach rate" value={`${unitAttachRate.toFixed(1)}%`} />
            </motion.div>
            {/* Row 7 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
                <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Rupees attach rate by Product Category</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={attachRateByCategory} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#888" domain={[0, 'dataMax+10']} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="category" type="category" stroke="#888" width={100} tick={{ fill: '#ddd' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" fill={COLORS_PRIMARY[3]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
                <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Trended Attach Rate</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendedAttachRate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#888" tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" wrapperStyle={{ color: '#aaa' }} />
                    <Line type="monotone" dataKey="rupeeRate" name="Rupee attach rate" stroke={COLORS_PRIMARY[0]} dot={false} />
                    <Line type="monotone" dataKey="unitRate" name="Unit attach rate" stroke={COLORS_PRIMARY[1]} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            {/* Row 8 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              <DonutCard title="All Claims By Failure Type" data={allClaimsByFailure} colors={COLORS_SECONDARY} />
              <DonutCard title="Approved Claims By Failure Type" data={approvedClaimsByFailure} colors={COLORS_PRIMARY} />
            </motion.div>
          </>
        )}

        {activeTab === 'Shipping Protection' && (
          <>
            {/* Row 1 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-5 tw-gap-4">
              <MetricCard label="Total Contract Sales" value={`₹ ${shippingMetrics.totalContractSales.toLocaleString()}`} />
              <MetricCard label="Contracts Sold" value={`${shippingMetrics.totalContractsSold.toLocaleString()}+`} />
              <MetricCard label="Merchant Revenue" value={`₹ ${shippingMetrics.merchantRevenue.toLocaleString()}`} />
              <MetricCard label="Average Contract Price" value={`₹ ${shippingMetrics.averageContractPrice.toLocaleString()}`} />
              <MetricCard
                label="Average Order Value"
                value={`${shippingMetrics.averageOrderValuePct.toFixed(2)}%`}
                subLabel="(for insurable orders)"
              />
            </motion.div>
            {/* Row 2 */}
            <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
              <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Trended Contracts Sales</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendedContracts} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis yAxisId="left" orientation="left" stroke="#888" tickFormatter={v => `₹${v / 1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" tickFormatter={v => v.toString()} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" wrapperStyle={{ color: '#aaa' }} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Contracts Sales" stroke={COLORS_SECONDARY[1]} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="units" name="Contracts Sold" stroke={COLORS_PRIMARY[0]} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Row 3 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <MetricCard label="Rupees attach rate" value={`${rupeesAttachRate.toFixed(1)}%`} />
              <MetricCard label="Unit attach rate" value={`${unitAttachRate.toFixed(1)}%`} />
            </motion.div>
            {/* Row 4 */}
            <motion.div variants={itemVariants} className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
                <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Unit attach rate by Price Band</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={unitAttachByBand} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#888" domain={[0, 'dataMax+10']} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="band" type="category" stroke="#888" width={100} tick={{ fill: '#ddd' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" fill={COLORS_PRIMARY[3]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700">
                <div className="tw-text-sm tw-text-gray-400 tw-mb-2">Trended Attach Rate</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendedAttach} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#888" tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" wrapperStyle={{ color: '#aaa' }} />
                    <Line type="monotone" dataKey="rupee" name="Rupee attach rate" stroke={COLORS_SECONDARY[0]} dot={false} />
                    <Line type="monotone" dataKey="unit" name="Unit attach rate" stroke={COLORS_PRIMARY[0]} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            {/* Row 5a */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <MetricCard label="Total Claims" value={totalClaims.toString()} />
              <MetricCard label="Claims Approval Rate" value={`${approvalRate.toFixed(2)}%`} />
            </div>
            {/* Row 5b */}
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
              <DonutCard title="All Claims by Failure Type" data={allShipClaims} colors={COLORS_PRIMARY} />
              <DonutCard title="Approved Claims by Failure Type" data={approvedShipClaims} colors={COLORS_SECONDARY} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ─── shared MetricCard & DonutCard ────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string;
  subLabel?: string;
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value, subLabel }) => (
  <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-6 tw-border tw-border-gray-700">
    <div className="tw-text-sm tw-text-gray-400">{label}</div>
    <div className="tw-text-2xl tw-font-semibold tw-text-white tw-mt-2">{value}</div>
    {subLabel && <div className="tw-text-xs tw-text-gray-500">{subLabel}</div>}
  </div>
);

interface DonutCardProps {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  isCurrency?: boolean;
}
const DonutCard: React.FC<DonutCardProps> = ({ title, data, colors }) => (
  <div className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-4 tw-border tw-border-gray-700 tw-overflow-visible">
    <div className="tw-text-sm tw-text-gray-400 tw-mb-2">{title}</div>
    <ResponsiveContainer width="100%" height={200} className="tw-overflow-visible">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          innerRadius={30}
          label={(e) => e.name}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default Analytics;
