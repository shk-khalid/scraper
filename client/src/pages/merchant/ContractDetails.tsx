// src/pages/ContractDetailPage.tsx
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, X } from 'lucide-react'
import {
  getContractDetails,
  editContractDetails,
  EditContractDetailsRequest,
} from '@/services/contractService'
import { ContractDetails, FormData } from '@/types'
import toast from 'react-hot-toast'

const ContractDetailPage: React.FC = () => {
  const { contractId: id } = useParams<{ contractId: string }>()
  const [detail, setDetail] = useState<ContractDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // UI state
  const [isEditing, setIsEditing] = useState(false)
  const [shippingSame, setShippingSame] = useState(false)
  const [customerInfoOpen, setCustomerInfoOpen] = useState(true)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundConfirmed, setRefundConfirmed] = useState(false)

  // Editable formData
  const [formData, setFormData] = useState<FormData>({
    customerId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    shippingAddress: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingPinCode: '',
    shippingCountry: '',
  })

  /** Load detail on mount or when id changes */
  useEffect(() => {
    if (!id) return
    setLoading(true)
    getContractDetails(id)
      .then((cd) => {
        setDetail(cd)
        setFormData(cd.formData)
        setIsEditing(false)
        setShippingSame(false)
      })
      .catch((err) => {
        console.error('Failed to load contract details:', err)
        toast.error('Failed to load contract details')
      })
      .finally(() => setLoading(false))
  }, [id])

  /** Mirror billing ⇒ shipping whenever shippingSame toggles on */
  useEffect(() => {
    if (shippingSame) {
      setFormData((fd) => ({
        ...fd,
        shippingAddress: fd.address,
        shippingAddress2: fd.address2,
        shippingCity: fd.city,
        shippingState: fd.state,
        shippingPinCode: fd.pinCode,
        shippingCountry: fd.country,
      }))
    }
  }, [shippingSame])

  /** Reset refundConfirmed each time modal opens */
  useEffect(() => {
    if (showRefundModal) {
      setRefundConfirmed(false)
    }
  }, [showRefundModal])

  const handleInputChange = (field: keyof FormData, value: string) =>
    setFormData((fd) => ({ ...fd, [field]: value }))

  /** Called when Save Changes is clicked */
  const handleSave = async () => {
    if (!detail) return
    setSaving(true)

    
    const payload: EditContractDetailsRequest = {
      customer_id: formData.customerId, 
      policy_id: detail.contractInfo.contractId,   
      User_id: formData.customerId,               
      customer_data: {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
      },
      address: {
        zip: formData.pinCode,
        city: formData.city,
        name: formData.fullName,
        phone: null,
        company: null,
        country: formData.country,
        address1: formData.address,
        address2: formData.address2 || null,
        latitude: 0, // replace or remove if backend doesn’t need
        province: formData.state,
        last_name: formData.fullName.split(' ').slice(-1)[0] || '',
        longitude: 0, // replace or remove
        first_name: formData.fullName.split(' ')[0] || '',
        country_code: '', // replace if available
        province_code: '', // replace if available
      },
    }

    try {
      // Pass existing detail so service can fallback if mapping fails
      const updated = await editContractDetails(payload, detail)
      console.log('Updated detail:', updated)
      setDetail(updated)
      setFormData(updated.formData)
      setIsEditing(false)
      setShippingSame(false)
      toast.success('Contract updated successfully!')
    } catch (err) {
      console.error('Save failed:', err)
      // Optionally show a toast/toastr here
      // If mapping fails and no fallback, detail remains unchanged
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (detail) {
      setFormData(detail.formData)
    }
    setIsEditing(false)
    setShippingSame(false)
  }

  const handleReportRefund = () => {
    console.log('Report refund for', id)
    setShowRefundModal(false)
  }

  const displayName = isEditing
  ? detail?.formData.fullName         // still show the old, saved name while editing
  : formData.fullName   

  if (loading) {
    return (
      <div className="tw-min-h-screen tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-w-12 tw-h-12 tw-border-t-4 tw-border-cyan-400 tw-border-solid tw-rounded-full tw-animate-spin" />
      </div>
    )
  }
  if (!detail) {
    // Optional: show “Not Found” or error UI
    return null
  }

  const { transactionInfo, storeInfo, contractInfo, shipments, unassignedProducts } = detail
  const refundAmount = contractInfo.purchasePrice

  return (
    <div className="tw-p-4 tw-bg-[#202020] tw-min-h-screen">
      {/* Breadcrumb */}
      <div className="tw-text-gray-400 tw-text-sm tw-flex tw-items-center tw-space-x-2 tw-mb-4">
        <Link to="/merchant/contracts" className="tw-flex tw-items-center tw-gap-1 hover:tw-text-white">
          <ArrowLeft size={16} /> <span>Contracts</span>
        </Link>
        <span>›</span>
        <span className="tw-text-white">{displayName}’s Contract</span>
      </div>

      {/* Header */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-mb-6 tw-gap-4">
        <div>
          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
            <h1 className="tw-text-2xl tw-font-semibold tw-text-white">
              {displayName}’s Contract
            </h1>
            <span className="tw-px-2 tw-py-1 tw-text-xs tw-bg-green-900 tw-text-green-300 tw-rounded">
              {contractInfo.status}
            </span>
          </div>
          <div className="tw-text-gray-400 tw-text-sm tw-space-y-1">
            <div>
              ID: <span className="tw-text-white">{contractInfo.contractId}</span>
            </div>
            <div>
              Type: <span className="tw-text-white">{contractInfo.planCategory}</span>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-space-x-2">
          <button className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white">
            File a Claim
          </button>
          <button
            onClick={() => setShowRefundModal(true)}
            className="tw-px-4 tw-py-2 tw-border tw-border-cyan-400 tw-text-cyan-400 tw-rounded hover:tw-bg-cyan-400 hover:tw-text-white"
          >
            Refund
          </button>
        </div>
      </div>

      <div className="tw-border-b tw-border-[#4c4c4c] tw-mb-6" />

      <div className="tw-space-y-4">
        {/* Customer Information Collapsible (controlled) */}
        <Collapsible
          title="Customer Information"
          isOpen={customerInfoOpen}
          onToggle={() => setCustomerInfoOpen((o) => !o)}
        >
          {/* Basic Information */}
          <div>
            <h2 className="tw-text-xl tw-font-medium tw-text-white tw-mb-4">
              Basic Information
            </h2>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
              {(['fullName', 'phoneNumber', 'email'] as (keyof FormData)[]).map(
                (field, i) => {
                  const labels = ['Full Name', 'Phone Number', 'Email']
                  const label = labels[i]
                  const value = formData[field]
                  return (
                    <div key={field}>
                      <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                        {label}
                      </label>
                      {isEditing ? (
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          value={value}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className="tw-w-full tw-px-3 tw-py-2 tw-rounded tw-text-[#FCFCFC] tw-text-sm tw-bg-[#363636] tw-border tw-border-[#FCFCFC]"
                        />
                      ) : (
                        <p className="tw-text-white tw-text-sm">{value}</p>
                      )}
                    </div>
                  )
                }
              )}
            </div>
          </div>

          {/* Billing Information */}
          <div>
            <h3 className="tw-text-xl tw-font-medium tw-text-white tw-mb-4">
              Billing Information
            </h3>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-6 tw-gap-4">
              {(
                ['address', 'address2', 'city', 'state', 'pinCode', 'country'] as (
                  keyof FormData
                )[]
              ).map((field, idx) => {
                const labels = [
                  'Address',
                  'Address 2',
                  'City',
                  'State',
                  'PIN Code',
                  'Country',
                ]
                const label = labels[idx]
                const value = formData[field]
                return (
                  <div key={field}>
                    <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                      {label}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="tw-w-full tw-px-3 tw-py-2 tw-rounded tw-text-[#FCFCFC] tw-text-sm tw-bg-[#363636] tw-border tw-border-[#FCFCFC]"
                      />
                    ) : (
                      <p className="tw-text-white tw-text-sm">{value}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <h3 className="tw-text-xl tw-font-medium tw-text-white">
                Shipping Information
              </h3>
              <label className="tw-flex tw-items-center tw-text-sm tw-text-gray-400">
                <input
                  type="checkbox"
                  checked={shippingSame}
                  onChange={(e) => setShippingSame(e.target.checked)}
                  disabled={!isEditing}
                  className="tw-mr-2"
                />
                Same as Billing Address
              </label>
            </div>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-6 tw-gap-4">
              {(
                [
                  'shippingAddress',
                  'shippingAddress2',
                  'shippingCity',
                  'shippingState',
                  'shippingPinCode',
                  'shippingCountry',
                ] as (keyof FormData)[]
              ).map((field, idx) => {
                const labels = [
                  'Address',
                  'Address 2',
                  'City',
                  'State',
                  'PIN Code',
                  'Country',
                ]
                const label = labels[idx]
                const value = formData[field]
                const disabledInput = !isEditing || shippingSame
                return (
                  <div key={field}>
                    <label className="tw-block tw-text-sm tw-text-gray-400 tw-mb-1">
                      {label}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        disabled={disabledInput}
                        className={`tw-w-full tw-px-3 tw-py-2 tw-rounded tw-text-[#FCFCFC] tw-text-sm ${
                          disabledInput
                            ? 'tw-bg-[#2a2a2a] tw-border tw-border-[#4C4C4C]'
                            : 'tw-bg-[#363636] tw-border tw-border-[#FCFCFC]'
                        }`}
                      />
                    ) : (
                      <p className="tw-text-white tw-text-sm">{value}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Edit / Save Buttons */}
          <div className="tw-flex tw-justify-end tw-space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="tw-px-6 tw-py-2 tw-text-sm tw-rounded-md tw-border tw-border-[#434343] tw-text-[#434343] hover:tw-bg-[#434343] hover:tw-text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`tw-px-6 tw-py-2 tw-text-sm tw-rounded-md tw-bg-[#434343] tw-text-white hover:tw-bg-[#5a5a5a] ${
                    saving ? 'tw-opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="tw-px-6 tw-py-2 tw-text-sm tw-rounded-md tw-bg-[#434343] tw-text-white hover:tw-bg-[#5a5a5a]"
              >
                Edit
              </button>
            )}
          </div>
        </Collapsible>

        {/* Transaction Information */}
        <Collapsible title="Transaction Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Transaction ID</p>
              <p className="tw-text-white tw-text-sm">{transactionInfo.transactionId}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Currency Code</p>
              <p className="tw-text-white tw-text-sm">{transactionInfo.currencyCode}</p>
            </div>
          </div>
        </Collapsible>

        {/* Store Information */}
        <Collapsible title="Store Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Store Name</p>
              <p className="tw-text-white tw-text-sm">{storeInfo.storeName}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Store ID</p>
              <p className="tw-text-white tw-text-sm">{storeInfo.storeId}</p>
            </div>
          </div>
        </Collapsible>

        {/* Contract Information */}
        <Collapsible title="Contract Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-6">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Contract ID</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.contractId}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Status</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.status}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Plan ID</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.planId || '--'}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Date Updated</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.dateUpdated}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Purchase Price</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.purchasePrice}</p>
            </div>
            <div className="tw-block md:tw-hidden lg:tw-block" />
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Plan Category</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.planCategory}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Transaction Date</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.transactionDate}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Date Refunded</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.dateRefunded}</p>
            </div>
            <div className="tw-block md:tw-hidden lg:tw-block" />
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Date Canceled</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.dateCanceled}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Plan Transaction ID</p>
              <p className="tw-text-white tw-text-sm">{contractInfo.planTransactionId || '--'}</p>
            </div>
          </div>
        </Collapsible>

        {/* Product & Shipping */}
        <Collapsible title="Product & Shipping">
          {shipments.map((sh, idx) => (
            <div key={idx} className="tw-space-y-3">
              <h3 className="tw-text-white tw-font-medium tw-text-lg">{sh.title}</h3>
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-text-sm">
                <div>
                  <p className="tw-text-gray-400">Shipping Provider</p>
                  <p className="tw-text-white">{sh.shippingProvider}</p>
                </div>
                <div>
                  <p className="tw-text-gray-400">Tracking ID</p>
                  <p className="tw-text-white">{sh.trackingId}</p>
                </div>
                <div>
                  <p className="tw-text-gray-400">Shipping Status</p>
                  <p className="tw-text-white">{sh.shippingStatus}</p>
                </div>
              </div>
              <div className="tw-mt-2">
                <p className="tw-text-gray-400 tw-text-sm">Shipment ID</p>
                <p className="tw-text-white tw-text-sm">{sh.shipmentId}</p>
              </div>
              <div className="tw-overflow-x-auto">
                <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-400">
                  <thead>
                    <tr className="tw-border-b tw-border-[#333333]">
                      <th className="tw-py-2">Name</th>
                      <th className="tw-py-2">Product Reference ID</th>
                      <th className="tw-py-2">List Price</th>
                      <th className="tw-py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sh.items.map((it, i) => (
                      <tr key={i} className="tw-border-b tw-border-[#333333]">
                        <td className="tw-py-2 tw-text-white">{it.name}</td>
                        <td className="tw-py-2 tw-text-white">{it.productRefId}</td>
                        <td className="tw-py-2 tw-text-white">{it.listPrice}</td>
                        <td className="tw-py-2 tw-text-white">{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {unassignedProducts.length > 0 && (
            <div className="tw-space-y-2">
              <h3 className="tw-text-white tw-font-medium tw-text-lg">NO SHIPMENT ASSIGNED</h3>
              <div className="tw-overflow-x-auto">
                <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-400">
                  <thead>
                    <tr className="tw-border-b tw-border-[#333333]">
                      <th className="tw-py-2">Name</th>
                      <th className="tw-py-2">Product Reference ID</th>
                      <th className="tw-py-2">List Price</th>
                      <th className="tw-py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedProducts.map((it, i) => (
                      <tr key={i} className="tw-border-b tw-border-[#333333]">
                        <td className="tw-py-2 tw-text-white">{it.name}</td>
                        <td className="tw-py-2 tw-text-white">{it.productRefId}</td>
                        <td className="tw-py-2 tw-text-white">{it.listPrice}</td>
                        <td className="tw-py-2 tw-text-white">{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Collapsible>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <Modal onClose={() => setShowRefundModal(false)}>
          <div className="tw-flex tw-justify-between tw-items-center tw-px-5 tw-py-3 tw-border-b tw-border-[#4C4C4C]">
            <h2 className="tw-text-lg tw-font-semibold tw-text-white">Refund Instructions</h2>
            <button
              onClick={() => setShowRefundModal(false)}
              className="tw-p-2 tw-rounded hover:tw-bg-[#333333]"
              aria-label="Close modal"
            >
              <X size={20} className="tw-text-gray-400 hover:tw-text-white" />
            </button>
          </div>
          <div className="tw-px-5 tw-pt-4 tw-pb-2 tw-space-y-4">
            <p className="tw-text-sm">
              <span className="tw-font-medium">Amount to Refund Customer: </span>
              <span className="tw-text-white">{refundAmount}</span>
            </p>
            <p className="tw-text-sm tw-text-gray-300">
              Refund your customer the amount listed above via your own payment system, then click Report Refund to notify Protega. Protega will credit you the same amount at the end of the current invoice cycle.
            </p>
            <label className="tw-flex tw-items-start tw-space-x-2">
              <input
                type="checkbox"
                checked={refundConfirmed}
                onChange={(e) => setRefundConfirmed(e.target.checked)}
                className="tw-h-4 tw-w-4 tw-text-cyan-400 tw-bg-[#363636] tw-border tw-border-[#4C4C4C]"
              />
              <span className="tw-text-sm tw-text-white tw-leading-snug">
                I refunded my end customer. I’m ready to cancel the customer’s contract and prevent any further claims from being filed against it.
              </span>
            </label>
          </div>
          <div className="tw-flex tw-justify-end tw-space-x-3 tw-px-5 tw-py-3 tw-border-t tw-border-[#4C4C4C]">
            <button
              onClick={() => setShowRefundModal(false)}
              className="tw-px-4 tw-py-2 tw-text-sm tw-rounded-md tw-border tw-border-[#4C4C4C] tw-text-gray-400 hover:tw-bg-[#333333] hover:tw-text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleReportRefund}
              disabled={!refundConfirmed}
              className={`tw-px-4 tw-py-2 tw-text-sm tw-rounded-md tw-transition-colors ${
                refundConfirmed
                  ? 'tw-bg-cyan-400 tw-text-white hover:tw-bg-cyan-500'
                  : 'tw-bg-[#3a3a3a] tw-text-gray-500 cursor-not-allowed'
              }`}
            >
              Report Refund
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/** Collapsible: controlled if isOpen/onToggle provided; otherwise internal */
interface CollapsibleProps {
  title: string
  isOpen?: boolean
  onToggle?: () => void
  children: React.ReactNode
}
const Collapsible: React.FC<CollapsibleProps> = ({ title, isOpen, onToggle, children }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen((o) => !o)
    }
  }

  return (
    <div className="tw-border tw-border-[#4C4C4C] tw-rounded-lg">
      <button
        onClick={handleToggle}
        className="tw-w-full tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-[202020] tw-text-white"
      >
        <span className="tw-text-xl tw-font-medium">{title}</span>
        <ChevronRight
          size={16}
          className={`tw-transform tw-transition-transform ${open ? 'tw-rotate-90' : ''}`}
        />
      </button>
      {open && <div className="tw-p-6 tw-space-y-4">{children}</div>}
    </div>
  )
}

/** Simple Modal wrapper */
interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}
const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
  <div
    className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-60 tw-flex tw-justify-center tw-items-center tw-z-50"
    onClick={onClose}
  >
    <div
      className="tw-bg-[#242424] tw-rounded-lg tw-w-full tw-max-w-md tw-shadow-2xl tw-border tw-border-[#4C4C4C]"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
)

export default ContractDetailPage
