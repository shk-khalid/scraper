import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { ClaimDetails } from '@/types'
import { getClaimsDetail } from '@/services/claimService'


const ClaimDetailPage: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>()
  const [detail, setDetail] = useState<ClaimDetails | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!claimId) {
      setLoading(false)
      return
    }

    setLoading(true)

    getClaimsDetail(claimId)
      .then((fetched) => {
        setDetail(fetched)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [claimId])

  if (loading || !detail) {
    return (
      <div className="tw-min-h-screen tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-w-12 tw-h-12 tw-border-t-4 tw-border-cyan-400 tw-border-solid tw-rounded-full tw-animate-spin" />
      </div>
    )
  }

  const { customerInfo, claimInfo, productInfo, serviceOrderInfo } = detail

  return (
    <div className="tw-p-4 tw-bg-[#202020] tw-min-h-screen tw-space-y-6">
      {/* Breadcrumb */}
      <div className="tw-text-gray-400 tw-text-sm tw-flex tw-items-center tw-space-x-2">
        <Link to="/merchant/claims" className="tw-flex tw-items-center tw-gap-1 hover:tw-text-white">
          <ArrowLeft size={16} /> <span>Claims</span>
        </Link>
        <span>›</span>
        <span className="tw-text-white">{customerInfo.fullName}’s Claim</span>
      </div>

      {/* Header */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-gap-4">
        <div>
          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
            <h1 className="tw-text-2xl tw-font-semibold tw-text-white">
              {customerInfo.fullName}’s Claim
            </h1>
            <span
              className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded-full ${detail.status === 'Approved'
                  ? 'tw-bg-green-900 tw-text-green-300'
                  : detail.status === 'Denied'
                    ? 'tw-bg-red-900 tw-text-red-300'
                    : 'tw-bg-yellow-900 tw-text-yellow-300'
                }`}
            >
              {detail.status}
            </span>
          </div>
          <div className="tw-text-gray-400 tw-text-sm tw-space-y-1">
            <div>
              Claim ID: <span className="tw-text-white">{detail.claimId}</span>
            </div>
            <div>
              Product: <span className="tw-text-white">{detail.product}</span>
            </div>
            <div>
              Contract: <span className="tw-text-white">{detail.contractId}</span>
            </div>
            <div>
              Type: <span className="tw-text-white">{detail.type}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-space-y-4">
        {/* Customer Information */}
        <Collapsible title="Customer Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Full Name</p>
              <p className="tw-text-white tw-text-sm">{customerInfo.fullName}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Phone Number</p>
              <p className="tw-text-white tw-text-sm">{customerInfo.phone}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Email</p>
              <p className="tw-text-white tw-text-sm">{customerInfo.email}</p>
            </div>
            <div className="md:tw-col-span-3">
              <p className="tw-text-gray-400 tw-text-sm">Address</p>
              <p className="tw-text-white tw-text-sm">{customerInfo.address}</p>
            </div>
          </div>
        </Collapsible>

        {/* Claim Information */}
        <Collapsible title="Claim Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Type</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.type}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Claims Status</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.statusDetail}</p>
            </div>
            <div className="md:tw-col-span-3">
              <p className="tw-text-gray-400 tw-text-sm">Incident Description</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.incidentDescription}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Fraudulent Activity</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.fraudulentActivity}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Store Name</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.storeName}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">PO Number</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.poNumber}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Store ID</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.storeId}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Coverage Years</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.coverageYears}</p>
            </div>
            <div className="md:tw-col-span-2">
              <p className="tw-text-gray-400 tw-text-sm">Coverage Term</p>
              <p className="tw-text-white tw-text-sm">{claimInfo.coverageTerm}</p>
            </div>
          </div>
        </Collapsible>

        {/* Product Information */}
        <Collapsible title="Product Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Product Name</p>
              <p className="tw-text-white tw-text-sm">{productInfo.name}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Product Manufacturer</p>
              <p className="tw-text-white tw-text-sm">{productInfo.manufacturer}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Model Number</p>
              <p className="tw-text-white tw-text-sm">{productInfo.modelNumber || '–––'}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Serial Number</p>
              <p className="tw-text-white tw-text-sm">{productInfo.serialNumber}</p>
            </div>
          </div>
        </Collapsible>

        {/* Service Order Information */}
        <Collapsible title="Service Order Information">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Service Order ID</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.serviceOrderId}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Service Type</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.serviceType}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Status</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.status}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Assignee</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.assignee}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Remaining Coverage</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.remainingCoverage}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Product List Price</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.productListPrice}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Defective Shipping Status</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.defectiveShippingStatus || '––'}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Defective Carrier</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.defectiveCarrier || '––'}</p>
            </div>
            <div>
              <p className="tw-text-gray-400 tw-text-sm">Tracking Number</p>
              <p className="tw-text-white tw-text-sm">{serviceOrderInfo.trackingNumber || '––'}</p>
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  )
}

/** Collapsible: internal open/close */
interface CollapsibleProps {
  title: string
  children: React.ReactNode
}
const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="tw-border tw-border-[#4C4C4C] tw-rounded-lg">
      <button
        onClick={() => setOpen(o => !o)}
        className="tw-w-full tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3  tw-text-white"
      >
        <span className="tw-text-xl tw-font-medium">{title}</span>
        <ChevronRight size={16} className={open ? 'tw-rotate-90 tw-transform' : ''} />
      </button>
      {open && <div className="tw-p-6 tw-space-y-4">{children}</div>}
    </div>
  )
}

export default ClaimDetailPage
