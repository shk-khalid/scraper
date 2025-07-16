import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Info } from 'lucide-react';


const fontOptions = [
  'Inter',
  'Arial',
  'Helvetica',
  'Roboto',
  'Open Sans',
  'Sans-serif'
];

const CustomizeLeadPage: React.FC = () => {
  const [formData, setFormData] = useState({
    sendLeadsEmails: false,
    leadEmailType: 'transactional',
    sendingEmailAddress: '',
    replyToEmailAddress: '',
    callToActiveUrl: '',
    emailOnPurchase: false,
    emailOnManufacturingWarrantyExpiration: false,
    storeName: '',
    storeLogoFile: null as File | null,
    fontFamily: '',
    lightBackground: false,
    backgroundColor: '#FFFFFF',
    primaryFontColor: '#000000',
    buttonColor: '#0077FF',
    buttonFontColor: '#FFFFFF',
    bodyFont: '',
    merchantAddress: '',
    privacyPolicyLink: '',
    merchantPhoneNumber: '',
    testEmailAddress: '',
    taglineText: 'A W E S O M E',
    poweredByText: 'powered by PROTEGA',
    footerBackgroundColor: '#CBD4C2',
    termsLink: '',
    termsText: 'Terms & Conditions',
    privacyText: 'Privacy Policy',
  });

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleInputChange('storeLogoFile', files[0]);
    }
  };

  const handleSendTestEmail = () => {
    console.log('Sending test email to:', formData.testEmailAddress);
  };

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

  const logoUrl = formData.storeLogoFile
    ? URL.createObjectURL(formData.storeLogoFile)
    : null;

  const previewFontFamily =
    formData.fontFamily || formData.bodyFont || undefined;

  const recipientEmail =
    formData.sendingEmailAddress || 'customer@example.com';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="tw-space-y-6"
    >
      <motion.div variants={itemVariants} className="tw-space-y-8">
        {/* Lead Email Configuration */}
        <motion.div
          variants={itemVariants}
          className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-6 tw-border tw-border-gray-700"
        >
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-100 tw-mb-2">
            Lead Email Configuration
          </h3>
          <p className="tw-text-sm tw-text-gray-400 tw-mb-4">
            Turn lead emails on or off, and change the type, frequency and details of emails.
          </p>
          <div className="tw-space-y-4">
            <div>
              <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.sendLeadsEmails}
                  onChange={e =>
                    handleInputChange('sendLeadsEmails', e.target.checked)
                  }
                  className="tw-mr-2"
                />
                Send emails to customers
              </label>
            </div>
            <div>
              <p className="tw-text-sm tw-font-medium tw-text-gray-100 tw-mb-2">
                Lead Email Type
              </p>
              <div className="tw-space-y-2">
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300">
                  <input
                    type="radio"
                    name="leadEmailType"
                    value="transactional"
                    checked={formData.leadEmailType === 'transactional'}
                    onChange={e =>
                      handleInputChange('leadEmailType', e.target.value)
                    }
                    className="tw-mr-2"
                  />
                  Transactional
                </label>
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300">
                  <input
                    type="radio"
                    name="leadEmailType"
                    value="marketing"
                    checked={formData.leadEmailType === 'marketing'}
                    onChange={e =>
                      handleInputChange('leadEmailType', e.target.value)
                    }
                    className="tw-mr-2"
                  />
                  Marketing
                </label>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Sending Email Address
                </label>
                <input
                  type="email"
                  placeholder="customer8@gmail.com"
                  value={formData.sendingEmailAddress}
                  onChange={e =>
                    handleInputChange('sendingEmailAddress', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Reply-to Email Address
                </label>
                <input
                  type="email"
                  placeholder="merchant@yourdomain.com"
                  value={formData.replyToEmailAddress}
                  onChange={e =>
                    handleInputChange('replyToEmailAddress', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Call-to-Action URL
                </label>
                <input
                  type="url"
                  placeholder="https://calltoactiveurl.com"
                  value={formData.callToActiveUrl}
                  onChange={e =>
                    handleInputChange('callToActiveUrl', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
            </div>
            <div>
              <p className="tw-text-sm tw-font-medium tw-text-gray-100 tw-mb-2">
                Emails Sent
              </p>
              <div className="tw-space-y-2">
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.emailOnPurchase}
                    onChange={e =>
                      handleInputChange('emailOnPurchase', e.target.checked)
                    }
                    className="tw-mr-2"
                  />
                  Email On Purchase
                </label>
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.emailOnManufacturingWarrantyExpiration}
                    onChange={e =>
                      handleInputChange(
                        'emailOnManufacturingWarrantyExpiration',
                        e.target.checked
                      )
                    }
                    className="tw-mr-2"
                  />
                  Email On Manufacturing Warranty Expiration
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customize Email Appearance */}
        <motion.div
          variants={itemVariants}
          className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-6 tw-border tw-border-gray-700"
        >
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-100 tw-mb-2">
            Customize Email Appearance
          </h3>
          <p className="tw-text-sm tw-text-gray-400 tw-mb-4">
            Change the way your lead emails will appear to customers.
          </p>
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
            <div className="tw-space-y-4">
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  placeholder="Store name"
                  value={formData.storeName}
                  onChange={e =>
                    handleInputChange('storeName', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
              <div>
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-400 tw-mb-1">
                  Store logo
                  <Info size={14} className="tw-ml-1 tw-text-gray-400" />
                </label>
                <div className="tw-relative tw-border tw-border-dashed tw-border-gray-600 tw-rounded tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2">
                  <Upload size={20} className="tw-text-gray-400" />
                  <input
                    type="file"
                    accept=".jpg,.png"
                    onChange={handleLogoUpload}
                    className="tw-absolute tw-opacity-0 tw-w-full tw-h-full tw-cursor-pointer"
                    style={{ top: 0, left: 0 }}
                  />
                  <p className="tw-text-xs tw-text-gray-500">
                    .JPG, PNG • max 6MB
                  </p>
                  {formData.storeLogoFile && (
                    <p className="tw-text-xs tw-text-gray-300">
                      {formData.storeLogoFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Font Family
                </label>
                <select
                  value={formData.fontFamily}
                  onChange={e =>
                    handleInputChange('fontFamily', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                >
                  <option value="">Select font</option>
                  {fontOptions.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-items-center tw-gap-2">
                <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-300 tw-flex-1">
                  <input
                    type="checkbox"
                    checked={formData.lightBackground}
                    onChange={e =>
                      handleInputChange('lightBackground', e.target.checked)
                    }
                    className="tw-mr-2"
                  />
                  Light background
                </label>
                {formData.lightBackground && (
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={e =>
                        handleInputChange('backgroundColor', e.target.value)
                      }
                      className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={e =>
                        handleInputChange('backgroundColor', e.target.value)
                      }
                      className="tw-w-20 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Primary Font Color
                </label>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <input
                    type="color"
                    value={formData.primaryFontColor}
                    onChange={e =>
                      handleInputChange('primaryFontColor', e.target.value)
                    }
                    className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded"
                  />
                  <input
                    type="text"
                    value={formData.primaryFontColor}
                    onChange={e =>
                      handleInputChange('primaryFontColor', e.target.value)
                    }
                    className="tw-w-24 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Button Color
                </label>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <input
                    type="color"
                    value={formData.buttonColor}
                    onChange={e =>
                      handleInputChange('buttonColor', e.target.value)
                    }
                    className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded"
                  />
                  <input
                    type="text"
                    value={formData.buttonColor}
                    onChange={e =>
                      handleInputChange('buttonColor', e.target.value)
                    }
                    className="tw-w-24 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw:ring-cyan-500 focus:tw-border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Button Font Color
                </label>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <input
                    type="color"
                    value={formData.buttonFontColor}
                    onChange={e =>
                      handleInputChange('buttonFontColor', e.target.value)
                    }
                    className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded"
                  />
                  <input
                    type="text"
                    value={formData.buttonFontColor}
                    onChange={e =>
                      handleInputChange('buttonFontColor', e.target.value)
                    }
                    className="tw-w-24 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Body Font
                </label>
                <select
                  value={formData.bodyFont}
                  onChange={e =>
                    handleInputChange('bodyFont', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                >
                  <option value="">Select font</option>
                  {fontOptions.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Merchant Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, City, Country"
                  value={formData.merchantAddress}
                  onChange={e =>
                    handleInputChange('merchantAddress', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Privacy Policy Link
                </label>
                <input
                  type="url"
                  placeholder="https://yourdomain.com/privacy"
                  value={formData.privacyPolicyLink}
                  onChange={e =>
                    handleInputChange('privacyPolicyLink', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
              <div>
                <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                  Merchant Phone Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="XXXXXXXXXXXX"
                  value={formData.merchantPhoneNumber}
                  onChange={e =>
                    handleInputChange('merchantPhoneNumber', e.target.value)
                  }
                  className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                />
              </div>
            </div>

            {/* Preview Section */}
            <motion.div
              variants={itemVariants}
              className="tw-bg-[#202020] tw-rounded-lg tw-p-4 tw-flex tw-justify-center"
            >
              <div
                className="tw-bg-[#F6F7F8] tw-p-4 tw-rounded-lg"
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <div
                  className="tw-bg-white tw-rounded-t-lg tw-p-6 tw-text-black tw-overflow-auto"
                  style={{
                    fontFamily: previewFontFamily,
                    color: formData.primaryFontColor,
                  }}
                >
                  <div className="tw-text-center tw-text-xs tw-text-gray-400 tw-uppercase tw-tracking-widest">
                    {formData.taglineText}
                  </div>
                  <div className="tw-text-center tw-mb-4">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="tw-h-12 tw-mx-auto tw-object-contain"
                      />
                    ) : (
                      <div className="tw-text-2xl tw-font-bold tw-text-gray-600">
                        LOGO
                      </div>
                    )}
                  </div>
                  <h2 className="tw-text-center tw-text-xl tw-font-bold tw-mb-6">
                    {formData.storeName
                      ? `Your recent purchase with ${formData.storeName}`
                      : 'Your recent purchase'}
                  </h2>
                  {formData.emailOnPurchase && (
                    <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center tw-mb-6">
                      <div className="tw-w-16 tw-h-16 tw-bg-gray-300 tw-rounded" />
                      <div />
                      <div className="tw-text-sm tw-text-gray-600">
                        <div className="tw-font-medium tw-text-gray-800">
                          Product Name
                        </div>
                        <div>Quantity</div>
                        <div>Price</div>
                      </div>
                      <div className="tw-text-sm tw-text-gray-600">
                        <div className="tw-font-medium tw-text-gray-800">&nbsp;</div>
                        <div>Purchase Date</div>
                        {formData.emailOnManufacturingWarrantyExpiration && (
                          <div>Warranty Expiration</div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="tw-text-center tw-mb-6">
                    <p className="tw-text-sm tw-text-gray-700 tw-mb-4">
                      {formData.leadEmailType === 'marketing'
                        ? 'Check out our latest offers and extend your protection.'
                        : "Extend your manufacturer's warranty by adding additional protection."}
                    </p>  
                    <a
                      href={formData.callToActiveUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tw-inline-block tw-px-6 tw-py-2 tw-rounded-full tw-font-medium"
                      style={{
                        backgroundColor: formData.buttonColor,
                        color: formData.buttonFontColor,
                        fontFamily: previewFontFamily,
                        textDecoration: 'none',
                      }}
                    >
                      {formData.leadEmailType === 'marketing'
                        ? 'View Offers'
                        : 'Add plan for $99.99'}
                    </a>
                    <div className="tw-text-xs tw-text-gray-400 tw-mt-2">
                      {formData.poweredByText}
                    </div>
                  </div>
                </div>
                <div
                  className="tw-p-6 tw-rounded-b-lg"
                  style={{
                    backgroundColor: formData.footerBackgroundColor,
                    color: formData.primaryFontColor,
                    fontFamily: previewFontFamily,
                  }}
                >
                  {formData.emailOnPurchase && (
                    <>
                      <h4 className="tw-font-semibold tw-text-black tw-mb-3">
                        What's Included
                      </h4>
                      <ul className="tw-text-sm tw-space-y-1 tw-text-black tw-mb-6">
                        <li>• Online claims (most are processed in 90 seconds or less!)</li>
                        <li>• Simple replacements and/or repairs</li>
                        <li>• Zero deductible</li>
                      </ul>
                    </>
                  )}
                  <div className="tw-flex tw-justify-center tw-space-x-6 tw-mb-6">
                    <a
                      href={formData.termsLink || '#'}
                      className="tw-text-sm tw-underline tw-text-gray-800"
                    >
                      {formData.termsText}
                    </a>
                    <a
                      href={formData.privacyPolicyLink || '#'}
                      className="tw-text-sm tw-underline tw-text-gray-800"
                    >
                      {formData.privacyText}
                    </a>
                  </div>
                  <div className="tw-text-center tw-text-xs tw-text-gray-600">
                    <div>
                      ©{formData.storeName || 'Your Store'} {new Date().getFullYear()}
                    </div>
                    {formData.merchantAddress && <div>{formData.merchantAddress}</div>}
                    {formData.merchantPhoneNumber && (
                      <div>{formData.merchantPhoneNumber}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Send Test Emails */}
        <motion.div
          variants={itemVariants}
          className="tw-bg-[#1c1c1e] tw-rounded-lg tw-p-6 tw-border tw-border-gray-700"
        >
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-100 tw-mb-2">
            Send Test Emails
          </h3>
          <p className="tw-text-sm tw-text-gray-400 tw-mb-4">
            Send test emails to yourself to preview them. All the emails you have configured in the Emails sent section will be sent to the address you provide.
          </p>
          <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4">
            <input
              type="email"
              placeholder="customer5@gmail.com"
              value={formData.testEmailAddress}
              onChange={e =>
                handleInputChange('testEmailAddress', e.target.value)
              }
              className="tw-flex-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
            />
            <button
              onClick={handleSendTestEmail}
              className="tw-px-4 tw-py-2 tw-text-sm tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white tw-transition-colors"
            >
              Send Test Email(s)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CustomizeLeadPage;
