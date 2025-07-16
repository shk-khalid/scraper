import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Edit2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  updateBankDetails,
  getMerchantActivePlans,
  enableDisableExtendedProtectionForAll,
  enableDisableShippingForAll,
  enableDisableAccidentalForAll,
} from '@/services/settingsService';

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

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const storeId = user?.id;

  const [copied, setCopied] = useState(false);

  // Unrelated form fields
  const [formData, setFormData] = useState({
    storeName: user?.shopUrl?.split('.')[0] || '',
    website: user?.shopUrl,
    ecommercePlatform: 'Shopify',
    leadConfigUrl: 'ABC-store-name.com',
    merchantId: 'ABC-store-name.com',
    bankName: '',
    accountNumber: '',
  });

  // Protection-related state
  const [allowedPlans, setAllowedPlans] = useState({
    extended: false,
    shipping: false,
    accidental: false,
  });
  const [activePlans, setActivePlans] = useState({
    extended: false,
    shipping: false,
    accidental: false,
  });
  const [loadingToggle, setLoadingToggle] = useState({
    extended: false,
    shipping: false,
    accidental: false,
  });

  // Editing states
  const [isEditingLeadConfig, setIsEditingLeadConfig] = useState(false);
  const [leadConfigTemp, setLeadConfigTemp] = useState(formData.leadConfigUrl);

  const [isEditingMID, setIsEditingMID] = useState(false);
  const [merchantIdTemp, setMerchantIdTemp] = useState(formData.merchantId);

  const [isEditingACH, setIsEditingACH] = useState(false);
  const [bankNameTemp, setBankNameTemp] = useState(formData.bankName);
  const [accountNumberTemp, setAccountNumberTemp] = useState(formData.accountNumber);

  // Fetch initial allowed & active plans
  useEffect(() => {
    if (!storeId) return;
    getMerchantActivePlans()
      .then(resp => {
        const { allowed_plans, active_plans } = resp.data;
        setAllowedPlans({
          extended: allowed_plans.extended,
          shipping: allowed_plans.shipping,
          accidental: allowed_plans.accidental,
        });
        setActivePlans({
          extended: active_plans.extended,
          shipping: active_plans.shipping,
          accidental: active_plans.accidental,
        });
      })
      .catch(err => {
        console.error('Failed to fetch merchant plans:', err);
        toast.error('Could not load protection settings.');
      });
  }, [storeId]);

  const handleCopy = () => {
    if (!storeId) {
      toast.error('No Store ID to copy');
      return;
    }
    navigator.clipboard
      .writeText(storeId)
      .then(() => {
        setCopied(true);
        toast.success('Store ID copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Clipboard write failed', err);
        toast.error('Failed to copy');
      });
  };

  // Toggle handlers (no toast on disabled)
  const onToggleExtended = async () => {
    if (!allowedPlans.extended || loadingToggle.extended) {
      return;
    }
    setLoadingToggle(prev => ({ ...prev, extended: true }));
    try {
      const resp = await enableDisableExtendedProtectionForAll();
      setActivePlans({
        extended: resp.data.extended,
        shipping: resp.data.shipping,
        accidental: resp.data.accidental,
      });
      toast.success('Updated extended protection setting');
    } catch (err: any) {
      console.error('Error toggling extended protection:', err);
      toast.error(`Could not update extended protection: ${err.message || err}`);
    } finally {
      setLoadingToggle(prev => ({ ...prev, extended: false }));
    }
  };

  const onToggleShipping = async () => {
    if (!allowedPlans.shipping || loadingToggle.shipping) {
      return;
    }
    setLoadingToggle(prev => ({ ...prev, shipping: true }));
    try {
      const resp = await enableDisableShippingForAll();
      setActivePlans({
        extended: resp.data.extended,
        shipping: resp.data.shipping,
        accidental: resp.data.accidental,
      });
      toast.success('Updated shipping protection setting');
    } catch (err: any) {
      console.error('Error toggling shipping protection:', err);
      toast.error(`Could not update shipping protection: ${err.message || err}`);
    } finally {
      setLoadingToggle(prev => ({ ...prev, shipping: false }));
    }
  };

  const onToggleAccidental = async () => {
    if (!allowedPlans.accidental || loadingToggle.accidental) {
      return;
    }
    setLoadingToggle(prev => ({ ...prev, accidental: true }));
    try {
      const resp = await enableDisableAccidentalForAll();
      setActivePlans({
        extended: resp.data.extended,
        shipping: resp.data.shipping,
        accidental: resp.data.accidental,
      });
      toast.success('Updated accidental protection setting');
    } catch (err: any) {
      console.error('Error toggling accidental protection:', err);
      toast.error(`Could not update accidental protection: ${err.message || err}`);
    } finally {
      setLoadingToggle(prev => ({ ...prev, accidental: false }));
    }
  };

  // Lead Config handlers
  const startEditLeadConfig = () => {
    setLeadConfigTemp(formData.leadConfigUrl);
    setIsEditingLeadConfig(true);
  };
  const saveLeadConfig = () => {
    setFormData(prev => ({ ...prev, leadConfigUrl: leadConfigTemp }));
    setIsEditingLeadConfig(false);
    console.log('Saving leadConfigUrl:', leadConfigTemp);
    // TODO: API call if needed
  };
  const cancelLeadConfig = () => {
    setLeadConfigTemp(formData.leadConfigUrl);
    setIsEditingLeadConfig(false);
  };
  const restoreDefaultLeadConfig = () => {
    setLeadConfigTemp('');
  };

  // MID handlers
  const startEditMID = () => {
    setMerchantIdTemp(formData.merchantId);
    setIsEditingMID(true);
  };
  const saveMID = () => {
    setFormData(prev => ({ ...prev, merchantId: merchantIdTemp }));
    setIsEditingMID(false);
    console.log('Saving merchantId:', merchantIdTemp);
    // TODO: API call if needed
  };
  const cancelMID = () => {
    setMerchantIdTemp(formData.merchantId);
    setIsEditingMID(false);
  };

  // ACH handlers
  const startEditACH = () => {
    setBankNameTemp(formData.bankName);
    setAccountNumberTemp(formData.accountNumber);
    setIsEditingACH(true);
  };
  const saveACH = async () => {
    setFormData(prev => ({
      ...prev,
      bankName: bankNameTemp,
      accountNumber: accountNumberTemp,
    }));
    setIsEditingACH(false);

    if (storeId) {
      try {
        await updateBankDetails(storeId, bankNameTemp, accountNumberTemp);
        toast.success('Bank details updated.');
      } catch (err: any) {
        console.error('Error updating bank details:', err);
        toast.error(`Couldn’t update bank details: ${err.message}`);
        // revert temps
        setBankNameTemp(formData.bankName);
        setAccountNumberTemp(formData.accountNumber);
      }
    }
    console.log('Saving ACH:', { bankName: bankNameTemp, accountNumber: accountNumberTemp });
  };
  const cancelACH = () => {
    setBankNameTemp(formData.bankName);
    setAccountNumberTemp(formData.accountNumber);
    setIsEditingACH(false);
  };

  // Helper to render toggle UI
  const renderToggle = (
    label: string,
    isAllowed: boolean,
    isActive: boolean,
    isLoading: boolean,
    onToggle: () => void,
    disabledMessage: string
  ) => (
    <div className="tw-flex tw-flex-col tw-space-y-2">
      <span className="tw-text-sm tw-text-gray-100 tw-font-medium">{label}</span>
      <div className="tw-flex tw-flex-row tw-items-center tw-space-x-2">
        <div
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyPress={e => {
            if ((e.key === 'Enter' || e.key === ' ') && isAllowed && !isLoading) {
              onToggle();
            }
          }}
          title={
            !isAllowed
              ? disabledMessage
              : isLoading
              ? 'Updating...'
              : ''
          }
          className={`
            tw-w-11 tw-h-6 tw-rounded-full tw-relative tw-transition
            ${isActive ? 'tw-bg-cyan-400' : 'tw-bg-gray-700'}
            ${(!isAllowed || isLoading)
              ? 'tw-opacity-50 tw-cursor-not-allowed'
              : 'tw-cursor-pointer'}
          `}
        >
          <div
            className={`
              tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-absolute tw-top-0.5 tw-transition
              ${isActive ? 'tw-left-5' : 'tw-left-0.5'}
            `}
          />
        </div>
        <span className="tw-text-xs tw-text-gray-400">
          {isAllowed
            ? isLoading
              ? 'Updating...'
              : isActive
              ? 'Live'
              : 'Not Live'
            : 'Not available'}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Settings</h1>
        <p className="tw-text-[#BBBBBB]">Manage your store settings</p>
      </motion.div>

      {/* Store Status & Toggles */}
      <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-border tw-border-[#4b4b4b] tw-p-6">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
          <div>
            <h3 className="tw-text-xl tw-font-medium tw-text-gray-100">Store status</h3>
            <p className="tw-text-sm tw-text-gray-400 tw-mt-2">
              Control whether protection offers appear in your store.
            </p>
          </div>
          <div className="tw-space-y-6">
            {/* Store ID */}
            <div className="tw-flex tw-items-center tw-space-x-2">
              <span className="tw-text-sm tw-text-gray-300">Store ID:</span>
              <span className="tw-text-sm tw-text-gray-400">{storeId || '—'}</span>
              <button onClick={handleCopy} className="tw-text-gray-400 hover:tw-text-white">
                {copied ? <Check className="tw-w-4 tw-h-4 tw-text-green-400"/> : <Copy className="tw-w-4 tw-h-4"/>}
              </button>
            </div>

            {/* Product Protection (Extended) */}
            {renderToggle(
              'Product Protection',
              allowedPlans.extended,
              activePlans.extended,
              loadingToggle.extended,
              onToggleExtended,
              'Extended protection not available'
            )}

            {/* Shipping Protection */}
            {renderToggle(
              'Shipping Protection',
              allowedPlans.shipping,
              activePlans.shipping,
              loadingToggle.shipping,
              onToggleShipping,
              'Shipping protection not available'
            )}

            {/* Accidental Protection */}
            {renderToggle(
              'Accidental Protection',
              allowedPlans.accidental,
              activePlans.accidental,
              loadingToggle.accidental,
              onToggleAccidental,
              'Accidental protection not available'
            )}
          </div>
        </div>
      </motion.div>

      {/* Store Details */}
      <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-border tw-border-[#4b4b4b] tw-p-6">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
          <div>
            <h3 className="tw-text-xl tw-font-medium tw-text-gray-100">Store details</h3>
            <p className="tw-text-sm tw-text-gray-400 tw-mt-2">
              You can edit these in{' '}
              <Link to="https://www.shopify.com" className="tw-text-cyan-400 hover:tw-text-cyan-300 tw-inline-flex tw-items-center tw-gap-1">
                Shopify <ExternalLink size={12}/>
              </Link>
            </p>
          </div>
          <div className="tw-space-y-4">
            <Detail label="Store Name" value={formData.storeName} />
            <Detail label="Website" value={formData.website} />
            <Detail label="Platform" value={formData.ecommercePlatform} />
          </div>
        </div>
      </motion.div>

      {/* Lead URL Configuration */}
      <EditableField
        title="Lead URL Configuration"
        description="Change how Lead URLs are formatted when you copy them from a Lead page"
        label="Lead Config URL"
        isEditing={isEditingLeadConfig}
        value={formData.leadConfigUrl}
        tempValue={leadConfigTemp}
        setTemp={setLeadConfigTemp}
        onStart={startEditLeadConfig}
        onSave={saveLeadConfig}
        onCancel={cancelLeadConfig}
        restoreDefault={restoreDefaultLeadConfig}
      />

      {/* Merchant Identification Number (MID) */}
      <EditableField
        title="Merchant Identification Number (MID)"
        description="Enter your MID to restrict customers’ virtual gift cards to your store"
        label="MID"
        isEditing={isEditingMID}
        value={formData.merchantId}
        tempValue={merchantIdTemp}
        setTemp={setMerchantIdTemp}
        onStart={startEditMID}
        onSave={saveMID}
        onCancel={cancelMID}
      />

      {/* Recurring Payment ACH Authorization */}
      <EditableField
        title="Recurring Payment ACH Authorization"
        description="Update your bank details for your monthly auto-debit payments to Protega"
        label="Bank Name"
        label2="Account Number"
        isEditing={isEditingACH}
        value1={formData.bankName}
        value2={formData.accountNumber}
        tempValue1={bankNameTemp}
        tempValue2={accountNumberTemp}
        setTemp1={setBankNameTemp}
        setTemp2={setAccountNumberTemp}
        onStart={startEditACH}
        onSave={saveACH}
        onCancel={cancelACH}
      />
    </motion.div>
  );
};

export default SettingsPage;

// Reusable Detail component
interface DetailProps {
  label: string;
  value?: string;
}
const Detail: React.FC<DetailProps> = ({ label, value }) => (
  <div>
    <label className="tw-block tw-text-sm tw-text-gray-400">{label}</label>
    <div className="tw-w-full tw-mt-1 tw-bg-[#2a2a2a] tw-text-gray-300 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm">
      {value || '—'}
    </div>
  </div>
);

// EditableField handles single or double inputs
type EditableFieldProps = {
  title: string;
  description: string;
  label: string;
  label2?: string;
  isEditing: boolean;
  value?: string;
  tempValue?: string;
  setTemp?: (v: string) => void;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
  restoreDefault?: () => void;
  // for two-field case:
  value1?: string;
  value2?: string;
  tempValue1?: string;
  tempValue2?: string;
  setTemp1?: (v: string) => void;
  setTemp2?: (v: string) => void;
};
const EditableField: React.FC<EditableFieldProps> = ({
  title,
  description,
  label,
  label2,
  isEditing,
  value,
  tempValue,
  setTemp,
  onStart,
  onSave,
  onCancel,
  restoreDefault,
  value1,
  value2,
  tempValue1,
  tempValue2,
  setTemp1,
  setTemp2,
}) => (
  <motion.div variants={itemVariants} className="tw-bg-[#1c1c1e] tw-rounded-lg tw-border tw-border-[#4b4b4b] tw-p-6">
    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
      <div>
        <h3 className="tw-text-xl tw-font-medium tw-text-gray-100">{title}</h3>
        <p className="tw-text-sm tw-text-gray-400 tw-mt-2">{description}</p>
      </div>
      <div className="tw-space-y-4">
        {/* First field */}
        <div>
          <label className="tw-block tw-text-sm tw-text-gray-400">{label}</label>
          {isEditing ? (
            <input
              type="text"
              value={label2 ? tempValue1 : tempValue}
              onChange={e => {
                if (label2) setTemp1 && setTemp1(e.target.value);
                else setTemp && setTemp(e.target.value);
              }}
              className="tw-w-full tw-mt-1 tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-sm"
            />
          ) : (
            <div className="tw-w-full tw-mt-1 tw-bg-[#2a2a2a] tw-text-gray-300 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm">
              {label2 ? value1 : value}
            </div>
          )}
        </div>
        {/* Second field if exists */}
        {label2 && (
          <div>
            <label className="tw-block tw-text-sm tw-text-gray-400">{label2}</label>
            {isEditing ? (
              <input
                type="text"
                value={tempValue2}
                onChange={e => setTemp2 && setTemp2(e.target.value)}
                className="tw-w-full tw-mt-1 tw-bg-[#202020] tw-text-gray-100 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-text-sm"
              />
            ) : (
              <div className="tw-w-full tw-mt-1 tw-bg-[#2a2a2a] tw-text-gray-300 tw-border tw-border-gray-700 tw-rounded tw-px-3 tw-py-2 tw-text-sm">
                {value2}
              </div>
            )}
          </div>
        )}
        {/* Action buttons */}
        <div className="tw-flex tw-gap-3">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-duration-700"
              >
                Save
              </button>
              {restoreDefault && (
                <button
                  onClick={restoreDefault}
                  className="tw-px-4 tw-py-2 tw-border tw-border-gray-600 tw-text-gray-400 tw-rounded hover:tw-bg-gray-800 tw-duration-700"
                >
                  Restore Default
                </button>
              )}
              <button
                onClick={onCancel}
                className="tw-px-4 tw-py-2 tw-border tw-border-gray-600 tw-text-gray-400 tw-rounded hover:tw-bg-gray-800 tw-duration-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onStart}
              className="tw-flex tw-items-center tw-gap-1 tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-duration-700"
            >
              <Edit2 className="tw-w-4 tw-h-4" /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);
