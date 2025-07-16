import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateLeadModalProps {
  onClose: () => void;
  onSave: (leadData: any) => void;
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    transactionId: 'TRN123458',
    email: 'customer@gmail.com',
    transactionDate: 'TRN123458',
    lineItemQty: '1',
    lineItemPrice: '20,0000',
    protegaProductReferenceId: 'Ref1234567890abcd-454',
    productName: 'EW -Hybrid Mattress(Includes extended protection)'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div className="tw-bg-gray-900 tw-rounded-lg tw-p-6 tw-w-full tw-max-w-2xl tw-mx-4">
        {/* Header */}
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h2 className="tw-text-xl tw-font-semibold tw-text-white">Create a new lead</h2>
          <button
            onClick={onClose}
            className="tw-text-gray-400 hover:tw-text-white tw-transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="tw-space-y-4">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div>
              <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Transaction ID</label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={(e) => handleInputChange('transactionId', e.target.value)}
                className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
              />
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Email(optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <div>
              <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Transaction Date</label>
              <input
                type="text"
                value={formData.transactionDate}
                onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
              />
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Line Item Qty</label>
              <input
                type="text"
                value={formData.lineItemQty}
                onChange={(e) => handleInputChange('lineItemQty', e.target.value)}
                className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
              />
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Line Item Price</label>
              <input
                type="text"
                value={formData.lineItemPrice}
                onChange={(e) => handleInputChange('lineItemPrice', e.target.value)}
                className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-2">Protega Product Reference ID</label>
            <input
              type="text"
              value={formData.protegaProductReferenceId}
              onChange={(e) => handleInputChange('protegaProductReferenceId', e.target.value)}
              className="tw-w-full tw-px-3 tw-py-2 tw-bg-gray-800 tw-border tw-border-gray-700 tw-rounded tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
            />
          </div>

          <div>
            <div className="tw-text-sm tw-text-gray-300 tw-mt-2">
              {formData.productName}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
          <button
            onClick={handleCancel}
            className="tw-px-4 tw-py-2 tw-text-sm tw-text-gray-400 tw-border tw-border-gray-600 tw-rounded hover:tw-bg-gray-800 tw-transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="tw-px-4 tw-py-2 tw-text-sm tw-bg-blue-600 tw-text-white tw-rounded hover:tw-bg-blue-700 tw-transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadModal;