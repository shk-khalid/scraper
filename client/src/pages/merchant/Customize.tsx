import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Upload,
  Monitor,
  Smartphone,
  Heart,
  DollarSign,
  X,
} from 'lucide-react';

import ProtegaLogo from "@/assets/desktopLogo.png";
import CoverImage from "@/assets/CoverImage.png";

const themes = [
  { name: 'default theme', status: 'Published' },
  { name: 'modern theme', status: 'Draft' },
  { name: 'minimal theme', status: 'Draft' }
];

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

const fontOptions = ['Inter', 'Arial', 'Helvetica', 'Georgia'];

type PreviewVariant = 'offer' | 'learnMore' | 'productPage';

const Customize: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('default theme');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Preview state: variant and device
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant>('offer');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Customization state
  const [custom, setCustom] = useState<{
    storeLogoFile: File | null;
    storeLogoUrl: string | null;
    backgroundColor: string;
    fontFamily: string;
    primaryFontColor: string;
    buttonColor: string;
    buttonFontColor: string;
    buttonCornerRadius: number;
  }>({
    storeLogoFile: null,
    storeLogoUrl: null,
    backgroundColor: '#38549C',
    fontFamily: 'Inter',
    primaryFontColor: '#000000',
    buttonColor: '#007FF6',
    buttonFontColor: '#FFFFFF',
    buttonCornerRadius: 4
  });

  // Manage object URL for uploaded logo
  const prevLogoUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (custom.storeLogoFile) {
      const objectUrl = URL.createObjectURL(custom.storeLogoFile);
      if (prevLogoUrlRef.current) URL.revokeObjectURL(prevLogoUrlRef.current);
      prevLogoUrlRef.current = objectUrl;
      setCustom(prev => ({ ...prev, storeLogoUrl: objectUrl }));
    } else if (prevLogoUrlRef.current) {
      URL.revokeObjectURL(prevLogoUrlRef.current);
      prevLogoUrlRef.current = null;
      setCustom(prev => ({ ...prev, storeLogoUrl: null }));
    }
    return () => {
      if (prevLogoUrlRef.current) {
        URL.revokeObjectURL(prevLogoUrlRef.current);
        prevLogoUrlRef.current = null;
      }
    };
  }, [custom.storeLogoFile]);

  const handleChange = (field: string, value: string | number | File | null) =>
    setCustom(prev => ({ ...prev, [field]: value }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('storeLogoFile', e.target.files?.[0] ?? null);
  };

  const normalizeHex = (val: string) =>
    val ? (val.startsWith('#') ? val : `#${val}`) : '';

  // For Product Page Offer preview: which duration is selected
  const [productOfferSelection, setProductOfferSelection] = useState<'1' | '2' | '3'>('2');
  // Example price data (replace with real data as needed)
  const productOfferPrices: Record<'1' | '2' | '3', { label: string; price: string }> = {
    '1': { label: '1 Year Protection', price: '₹799' },
    '2': { label: '2 Year Protection', price: '₹1200' },
    '3': { label: '3 Year Protection', price: '₹1499' },
  };

  // Variant list and helpers for pagination navigation
  const variants: PreviewVariant[] = ['offer', 'learnMore', 'productPage'];
  const currentVariantIndex = variants.findIndex(v => v === previewVariant);
  const goToPrevVariant = () => {
    const prevIndex = (currentVariantIndex - 1 + variants.length) % variants.length;
    setPreviewVariant(variants[prevIndex]);
  };
  const goToNextVariant = () => {
    const nextIndex = (currentVariantIndex + 1) % variants.length;
    setPreviewVariant(variants[nextIndex]);
  };

  return (
    <motion.div
      className="tw-bg-[#202020] tw-min-h-screen tw-p-6 tw-space-y-6 tw-overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Title */}
      <div className="tw-flex tw-items-center tw-justify-start tw-space-x-4 sm:tw-justify-between sm:tw-space-x-0">
        <div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-100">Customize Widget</h1>
          <p className="tw-text-[#BBBBBB]">
            Browse and configure your widget settings
          </p>

        </div>

      </div>

      {/* Selected Theme */}
      <motion.div
        variants={itemVariants}
        className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6"
      >
        <h3 className="tw-text-sm tw-font-medium tw-text-white tw-mb-3">Selected Theme</h3>
        <div className="tw-relative">
          <button
            onClick={() => setIsThemeDropdownOpen(o => !o)}
            className="tw-w-full tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
            aria-haspopup="listbox"
            aria-expanded={isThemeDropdownOpen}
          >
            <div className="tw-flex tw-items-center tw-gap-3">
              <span className="tw-capitalize">{selectedTheme}</span>
              <span className="tw-px-2 tw-py-1 tw-text-[10px] tw-font-medium tw-bg-green-600 tw-text-white tw-rounded">
                {themes.find(t => t.name === selectedTheme)?.status}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`tw-transform tw-transition-transform ${isThemeDropdownOpen ? 'tw-rotate-180' : ''}`}
            />
          </button>

          {isThemeDropdownOpen && (
            <div
              className="tw-absolute tw-top-full tw-left-0 tw-right-0 tw-mt-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-shadow-lg tw-z-10"
              role="listbox"
            >
              {themes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => {
                    setSelectedTheme(theme.name);
                    setIsThemeDropdownOpen(false);
                  }}
                  className="tw-w-full tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-text-sm tw-text-gray-100 hover:tw-bg-gray-700"
                  role="option"
                  aria-selected={selectedTheme === theme.name}
                >
                  <span className="tw-capitalize">{theme.name}</span>
                  <span className={`tw-px-2 tw-py-1 tw-text-[10px] tw-font-medium tw-rounded ${theme.status === 'Published'
                    ? 'tw-bg-green-600 tw-text-white'
                    : 'tw-bg-gray-600 tw-text-gray-300'
                    }`}>
                    {theme.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </motion.div>

      {/* Two-column layout: Left controls, Right preview */}
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">
        {/* Left: Customization Controls */}
        <motion.div variants={itemVariants} className="tw-space-y-6">
          {/* Theme Description */}
          <div className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6">
            <h3 className="tw-text-lg tw-font-medium tw-text-white tw-mb-1 tw-capitalize">{selectedTheme}</h3>
            <p className="tw-text-sm tw-text-gray-400">
              Edit this theme to customize how Protega offers look on your site.<br />
              Use the preview to see how the theme applies to different offers.
            </p>
          </div>

          {/* Store Logo Upload */}
          <div className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6">
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
              <span className="tw-text-sm tw-font-medium tw-text-white">Store logo</span>
              <Info size={14} className="tw-text-gray-400" />
            </div>
            <div className="tw-relative tw-border tw-border-dashed tw-border-gray-600 tw-rounded-lg tw-p-6 tw-bg-[#202020] tw-text-center">
              <Upload size={24} className="tw-text-gray-400 tw-mx-auto tw-mb-2" />
              <p className="tw-text-xs tw-text-gray-500">JPG, PNG • 4 MB max</p>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleLogoUpload}
                className="tw-absolute tw-opacity-0 tw-w-full tw-h-full tw-top-0 tw-left-0 tw-cursor-pointer"
              />
              {custom.storeLogoFile && (
                <p className="tw-text-xs tw-text-gray-300 tw-mt-2">
                  {custom.storeLogoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Background Color */}
          <div className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6">
            <label htmlFor="backgroundColor" className="tw-block tw-text-sm tw-font-medium tw-text-white tw-mb-2">
              Background Color
            </label>
            <div className="tw-flex tw-items-center tw-gap-3">
              <input
                id="backgroundColor"
                type="color"
                value={custom.backgroundColor}
                onChange={e => handleChange('backgroundColor', normalizeHex(e.target.value))}
                className="tw-w-10 tw-h-10 tw-p-0 tw-border tw-border-gray-600 tw-rounded-lg"
              />
              <input
                type="text"
                value={custom.backgroundColor}
                onChange={e => handleChange('backgroundColor', normalizeHex(e.target.value))}
                className="tw-flex-1 tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                placeholder="#38549C"
              />
            </div>
          </div>

          {/* Font & Colors */}
          <div className="tw-space-y-6">
            {/* Font Family & Primary Font Color */}
            <div className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                <div>
                  <label htmlFor="fontFamily" className="tw-block tw-text-sm tw-font-medium tw-text-white tw-mb-2">
                    Font Family
                  </label>
                  <div className="tw-relative">
                    <select
                      id="fontFamily"
                      value={custom.fontFamily}
                      onChange={e => handleChange('fontFamily', e.target.value)}
                      className="tw-w-full tw-px-3 tw-py-2 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500 tw-appearance-none"
                    >
                      {fontOptions.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="primaryFontColor" className="tw-block tw-text-sm tw-font-medium tw-text-white tw-mb-2">
                    Primary Font Color
                  </label>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <input
                      id="primaryFontColor"
                      type="color"
                      value={custom.primaryFontColor}
                      onChange={e => handleChange('primaryFontColor', normalizeHex(e.target.value))}
                      className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded-lg"
                    />
                    <input
                      type="text"
                      value={custom.primaryFontColor}
                      onChange={e => handleChange('primaryFontColor', normalizeHex(e.target.value))}
                      className="tw-flex-1 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-xs focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Button Color, Button Font Color, Corner Radius */}
            <div className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-4">
                <div>
                  <label htmlFor="buttonColor" className="tw-block tw-text-sm tw-font-medium tw-text-white tw-mb-2">
                    Button Color
                  </label>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <input
                      id="buttonColor"
                      type="color"
                      value={custom.buttonColor}
                      onChange={e => handleChange('buttonColor', normalizeHex(e.target.value))}
                      className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded-lg"
                    />
                    <input
                      type="text"
                      value={custom.buttonColor}
                      onChange={e => handleChange('buttonColor', normalizeHex(e.target.value))}
                      className="tw-flex-1 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-xs focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                      placeholder="#007FF6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="buttonFontColor" className="tw-block tw-text-sm tw-font-medium tw-text-white tw-mb-2">
                    Button Font Color
                  </label>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <input
                      id="buttonFontColor"
                      type="color"
                      value={custom.buttonFontColor}
                      onChange={e => handleChange('buttonFontColor', normalizeHex(e.target.value))}
                      className="tw-w-8 tw-h-8 tw-p-0 tw-border tw-border-gray-600 tw-rounded-lg"
                    />
                    <input
                      type="text"
                      value={custom.buttonFontColor}
                      onChange={e => handleChange('buttonFontColor', normalizeHex(e.target.value))}
                      className="tw-flex-1 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-xs focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-items-center tw-gap-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={custom.buttonCornerRadius}
                  onChange={e => handleChange('buttonCornerRadius', +e.target.value)}
                  className="tw-flex-1 tw-h-2 tw-bg-gray-700 tw-rounded-lg tw-appearance-none tw-cursor-pointer slider"
                />
                <div className="tw-flex tw-items-center tw-gap-1">
                  <input
                    type="number"
                    value={custom.buttonCornerRadius}
                    onChange={e => {
                      const v = +e.target.value;
                      if (!isNaN(v)) handleChange('buttonCornerRadius', v);
                    }}
                    className="tw-w-16 tw-px-2 tw-py-1 tw-bg-[#202020] tw-border tw-border-gray-600 tw-rounded-lg tw-text-gray-100 tw-text-sm focus:tw-outline-none focus:tw-ring-cyan-500 focus:tw-border-cyan-500"
                  />
                  <span className="tw-text-sm tw-text-gray-400">px</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Live Preview */}
        <motion.div
          variants={itemVariants}
          className="tw-bg-[#1c1c1e] tw-border tw-border-gray-700 tw-rounded-lg tw-p-6 tw-flex tw-flex-col"
        >


          {/* Preview Content */}

          {/* Preview Header with Pagination-style variant selector */}
          <div className="tw-flex tw-flex-col tw-items-center tw-mb-4">
            <h2 className="tw-text-lg tw-font-medium tw-text-white tw-mb-2">Preview</h2>
            <div className="tw-flex tw-items-center tw-gap-3">
              <ChevronLeft
                size={20}
                onClick={goToPrevVariant}
                className="tw-text-gray-400 tw-cursor-pointer hover:tw-text-white"
              />
              <div className="tw-flex tw-gap-1">
                {variants.map((v, idx) => (
                  <div
                    key={v}
                    className={`tw-w-2 tw-h-2 tw-rounded-full ${idx === currentVariantIndex ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                      }`}
                  />
                ))}
              </div>
              <ChevronRight
                size={20}
                onClick={goToNextVariant}
                className="tw-text-gray-400 tw-cursor-pointer hover:tw-text-white"
              />
            </div>
          </div>

          {/* Preview Content container */}
          <div className="tw-flex tw-justify-center tw-items-start tw-flex-1">
            {/* width depends on device */}
            <div className={`${previewDevice === 'desktop' ? 'tw-w-full tw-max-w-md' : 'tw-w-[240px]'}`}>
              {/* Title & subtitle */}
              <div className="tw-text-center tw-mb-4">
                {previewVariant === 'offer' && (
                  <>
                    <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-1">Offer Modal</h3>
                    <p className="tw-text-sm tw-text-gray-400">
                      This popup allows a customer to select an Extend protection plan
                    </p>
                  </>
                )}
                {previewVariant === 'learnMore' && (
                  <>
                    <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-1">Learn More Modal</h3>
                    <p className="tw-text-sm tw-text-gray-400">
                      This informational popup appears when a customer clicks "Learn More" in the Product Page Offer
                    </p>
                  </>
                )}
                {previewVariant === 'productPage' && (
                  <>
                    <h3 className="tw-text-lg tw-font-semibold tw-text-white tw-mb-1">Product Page Offer</h3>
                    <p className="tw-text-sm tw-text-gray-400">
                      This selector appears on product pages near the "Add to Cart" button
                    </p>
                  </>
                )}
              </div>

              {/* Variant-specific card */}
              {previewVariant === 'offer' && (
                <div className="tw-relative tw-bg-white tw-rounded-lg tw-shadow-xl tw-overflow-hidden">
                  {/* Close button */}
                  <button
                    onClick={() => {/* optionally simulate closing preview */ }}
                    className="tw-absolute tw-top-3 tw-right-3 tw-text-gray-500 hover:tw-text-gray-800"
                  >
                    <X size={16} />
                  </button>
                  <div className="tw-flex tw-flex-col sm:tw-flex-row">
                    {/* Left: colored content */}
                    <div
                      className="tw-w-full sm:tw-w-2/3 tw-p-6 tw-text-white"
                      style={{
                        backgroundColor: custom.backgroundColor,
                        fontFamily: custom.fontFamily
                      }}
                    >
                      <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                        <div className="tw-flex tw-items-center">
                          {/* Always show Protega logo */}
                          <img src={ProtegaLogo} alt="Protega" className="tw-h-8" />
                          {/* If user uploaded a store logo, show “×” and then the store logo */}
                          {custom.storeLogoUrl && (
                            <>
                              <span className="tw-text-white tw-mx-2">×</span>
                              <img
                                src={custom.storeLogoUrl}
                                alt="Store Logo"
                                className="tw-h-8 tw-object-contain"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="tw-mb-4">
                        <h4 className="tw-font-semibold tw-mb-1 tw-text-white">Limited-Time Offer!</h4>
                        <p className="tw-text-sm tw-opacity-90">Protect Your Sparkle with Protega</p>
                      </div>
                      <div className="tw-space-y-2 tw-mb-4">
                        <p className="tw-text-sm">Coverage Includes:</p>
                        <ul className="tw-list-disc tw-pl-4 tw-text-sm tw-leading-snug">
                          <li>Accidental damage protection</li>
                          <li>Shipping loss & theft coverage</li>
                          <li>Stone replacement guarantee</li>
                        </ul>
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                        <button className="tw-text-sm tw-underline">Details & FAQs</button>
                        <div className="tw-text-xs tw-opacity-70">Powered by Protega</div>
                      </div>
                      {/* Example plan boxes */}
                      <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-mb-4">
                        <div className="tw-border tw-border-blue-500 tw-rounded-lg tw-p-3">
                          <div className="tw-text-xs tw-font-medium">2 Year Protection</div>
                          <div className="tw-text-base tw-font-semibold">₹1200</div>
                        </div>
                        <div className="tw-border tw-border-blue-500 tw-rounded-lg tw-p-3 tw-relative">
                          <div className="tw-absolute tw-top-0 tw-right-0 tw-bg-blue-500 tw-text-white tw-text-[10px] tw-px-1 tw-py-[2px] tw-rounded-bl">
                            Best Value
                          </div>
                          <div className="tw-text-xs tw-font-medium">4 Year Protection</div>
                          <div className="tw-text-base tw-font-semibold">₹1600</div>
                        </div>
                      </div>
                      <div className="tw-flex tw-justify-between tw-items-center">
                        <button className="tw-text-sm tw-text-white tw-opacity-75 tw-underline">
                          I don't want Protection
                        </button>
                        <button
                          className="tw-px-4 tw-py-2 tw-font-medium tw-rounded"
                          style={{
                            backgroundColor: custom.buttonColor,
                            color: custom.buttonFontColor,
                            borderRadius: `${custom.buttonCornerRadius}px`,
                            fontFamily: custom.fontFamily
                          }}
                        >
                          Protect my purchase
                        </button>
                      </div>
                      <div className="tw-text-xs tw-opacity-60 tw-mt-4">Powered by Protega</div>
                    </div>
                    {/* Right: Cover Image */}
                    <div className="tw-w-full sm:tw-w-1/3 tw-min-w-[120px] tw-h-auto">
                      <img
                        src={CoverImage}
                        alt="Product"
                        className="tw-w-full tw-h-full tw-object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {previewVariant === 'learnMore' && (
                <div className="tw-relative tw-bg-white tw-rounded-lg tw-shadow-xl tw-overflow-hidden">
                  {/* Close button */}
                  <button
                    onClick={() => { }}
                    className="tw-absolute tw-top-3 tw-right-3 tw-text-gray-500 hover:tw-text-gray-800"
                  >
                    <X size={16} />
                  </button>
                  <div className="tw-flex tw-flex-col sm:tw-flex-row">
                    {/* Left: colored content */}
                    <div
                      className="tw-w-full sm:tw-w-2/3 tw-p-6 tw-text-white"
                      style={{
                        backgroundColor: custom.backgroundColor,
                        fontFamily: custom.fontFamily
                      }}
                    >
                      <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                        <div className="tw-flex tw-items-center">
                          <img src={ProtegaLogo} alt="Protega" className="tw-h-8" />
                          {custom.storeLogoUrl && (
                            <>
                              <span className="tw-text-white tw-mx-2">×</span>
                              <img
                                src={custom.storeLogoUrl}
                                alt="Store Logo"
                                className="tw-h-8 tw-object-contain"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="tw-mb-4">
                        <h4 className="tw-font-semibold tw-mb-1 tw-text-white">
                          Protect your product after the manufacturer's warranty expires with Protega.
                        </h4>
                      </div>
                      <div className="tw-space-y-2 tw-mb-4">
                        <p className="tw-text-sm">Coverage includes:</p>
                        <ul className="tw-list-disc tw-pl-4 tw-text-sm tw-leading-snug">
                          <li>Hassle-free repairs or replacements</li>
                          <li>Extended failure protection</li>
                          <li>Peace of mind when using your product</li>
                        </ul>
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                        <button className="tw-text-sm tw-underline">Details & FAQs</button>
                        <div className="tw-text-xs tw-opacity-70">Powered by Protega</div>
                      </div>
                      <div className="tw-space-y-3">
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <Heart size={18} className="tw-text-white" />
                          <span className="tw-text-sm tw-text-white">24/7 Online claims</span>
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <DollarSign size={18} className="tw-text-white" />
                          <span className="tw-text-sm tw-text-white">No deductibles</span>
                        </div>
                      </div>
                    </div>
                    {/* Right: Cover Image */}
                    <div className="tw-w-full sm:tw-w-1/3 tw-min-w-[120px] tw-h-auto">
                      <img
                        src={CoverImage}
                        alt="Product"
                        className="tw-w-full tw-h-full tw-object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {previewVariant === 'productPage' && (
                <div className="tw-relative tw-bg-white tw-rounded-lg tw-shadow-xl tw-overflow-hidden tw-p-6">
                  {/* Close button */}
                  <button
                    onClick={() => { }}
                    className="tw-absolute tw-top-3 tw-right-3 tw-text-gray-500 hover:tw-text-gray-800"
                  >
                    <X size={16} />
                  </button>
                  {/* “Add product protection offered by Protega” and info icon */}
                  <div className="tw-flex tw-items-center tw-gap-1 tw-mb-4" style={{ fontFamily: custom.fontFamily }}>
                    <p className="tw-text-sm tw-text-gray-700">
                      Add product protection offered by <span className="tw-font-semibold">Protega</span>
                    </p>
                    <Info size={14} className="tw-text-gray-400" />
                  </div>
                  {/* Three-option selector */}
                  <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-relative">
                    {(['1', '2', '3'] as ('1' | '2' | '3')[]).map(key => {
                      const isSelected = productOfferSelection === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setProductOfferSelection(key)}
                          className="tw-p-3 tw-rounded-lg tw-text-left tw-text-sm tw-font-medium tw-relative"
                          style={{
                            backgroundColor: isSelected ? custom.buttonColor : '#ffffff',
                            color: isSelected ? custom.buttonFontColor : custom.primaryFontColor,
                            borderRadius: `${custom.buttonCornerRadius}px`,
                            fontFamily: custom.fontFamily,
                            border: `1px solid ${isSelected ? custom.buttonColor : '#d1d5db'}`
                          }}
                        >
                          <div className="tw-text-xs">{productOfferPrices[key].label}</div>
                          <div className="tw-text-base tw-font-semibold">{productOfferPrices[key].price}</div>
                          {key === '2' && (
                            <div className="tw-text-[10px] tw-font-medium tw-text-white tw-bg-blue-500 tw-px-1 tw-py-[2px] tw-rounded-bl tw-absolute tw-top-0 tw-right-0">
                              Best Seller
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Device toggle + dots underneath */}
                  <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
                    <div className="tw-flex tw-gap-2">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`tw-p-2 tw-rounded-lg ${previewDevice === 'desktop' ? 'tw-bg-blue-600' : 'tw-bg-[#202020]'} tw-text-white`}
                      >
                        <Monitor size={16} />
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`tw-p-2 tw-rounded-lg ${previewDevice === 'mobile' ? 'tw-bg-blue-600' : 'tw-bg-[#202020]'} tw-text-white`}
                      >
                        <Smartphone size={16} />
                      </button>
                    </div>
                    <div className="tw-flex tw-gap-1 tw-mt-2">
                      <div
                        className={`tw-w-2 tw-h-2 tw-rounded-full ${previewDevice === 'desktop' ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                          }`}
                      />
                      <div
                        className={`tw-w-2 tw-h-2 tw-rounded-full ${previewDevice === 'mobile' ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Device toggle + dots underneath for Offer & Learn More */}
              {(previewVariant === 'offer' || previewVariant === 'learnMore') && (
                <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
                  <div className="tw-flex tw-gap-2">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`tw-p-2 tw-rounded-lg ${previewDevice === 'desktop' ? 'tw-bg-blue-600' : 'tw-bg-[#202020]'} tw-text-white`}
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`tw-p-2 tw-rounded-lg ${previewDevice === 'mobile' ? 'tw-bg-blue-600' : 'tw-bg-[#202020]'} tw-text-white`}
                    >
                      <Smartphone size={16} />
                    </button>
                  </div>
                  <div className="tw-flex tw-gap-1 tw-mt-2">
                    <div
                      className={`tw-w-2 tw-h-2 tw-rounded-full ${previewDevice === 'desktop' ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                        }`}
                    />
                    <div
                      className={`tw-w-2 tw-h-2 tw-rounded-full ${previewDevice === 'mobile' ? 'tw-bg-blue-500' : 'tw-bg-gray-600'
                        }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slider thumb styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  );
};

export default Customize;
