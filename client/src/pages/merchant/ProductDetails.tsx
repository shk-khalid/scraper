import React, { useState, useEffect, KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import {
  fetchRawProducts,
  toggleProtection,
  Product as APIProduct,
  ProductVariant,
} from '@/services/productService'
import { ProductDetail } from '@/types'

const mapApiVariantToString = (v: ProductVariant): string =>
  v.title || v.v_title || `Variant ${v.variant_id}`

const mapApiProductToDetail = (p: APIProduct): ProductDetail => {
  const v = p.variants[0]
  return {
    id: String(p.product_id),
    name: v.title,
    category: v.category.join(', ') || 'Uncategorized',
    price: v.price,
    currency: 'INR',
    image: v.image_url,
    imageUrl: v.image_url,
    description: v.description || 'No Description',
    variants: p.variants.map(mapApiVariantToString),
    mfgLengthLabor: 'N/A',
    mfgLengthLaborValue: 'N/A',
    brand: v.main_product_title,
    barcode: 'N/A',
    gtin: 'N/A',
    upc: 'N/A',
    asin: 'N/A',
    status: v.status,
    displayOffer: v.all_protection_active,
  }
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()

  const [data, setData] = useState<ProductDetail | null>(null)
  const [offerOn, setOfferOn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  let cancel = false

  if (!productId) {
    setLoading(false)
    return
  }

  ;(async () => {
    try {
      const prods = await fetchRawProducts()
      if (cancel) return

      const found = prods.find(p =>
        p.variants.some(v => v.id === productId)
      )
      if (!found) {
        console.error(`No product matched for variant UUID ${productId}`)
        setLoading(false)
        return
      }

      const detail = mapApiProductToDetail(found)
      setData(detail)
      setOfferOn(detail.displayOffer)
    } catch (err) {
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  })()

  return () => { cancel = true }
}, [productId])


  const toggleOffer = async () => {
    if (!data) return
    const prev = offerOn
    setOfferOn(!prev)
    try {
      const updated = await toggleProtection(Number(data.id))
      setOfferOn(updated)
    } catch {
      setOfferOn(prev)
    }
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleOffer()
    }
  }

  if (loading) {
    return (
      <div className="tw-p-4 tw-bg-[#202020] tw-min-h-screen tw-space-y-6">
        <div className="tw-animate-pulse tw-flex tw-items-center tw-space-x-4">
          <div className="tw-h-16 tw-w-16 tw-bg-gray-700 tw-rounded" />
          <div className="tw-flex-1 tw-space-y-4">
            <div className="tw-h-6 tw-bg-gray-700 tw-rounded w-3/4" />
            <div className="tw-h-4 tw-bg-gray-700 tw-rounded w-1/2" />
          </div>
        </div>
        <div className="tw-animate-pulse tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tw-h-20 tw-bg-gray-700 tw-rounded" />
          ))}
        </div>
        <div className="tw-animate-pulse tw-flex tw-space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="tw-h-32 tw-w-1/3 tw-bg-gray-700 tw-rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const {
    id,
    name,
    status,
    image,
    variants,
    description,
    price,
    category,
    currency,
    imageUrl,
  } = data

  return (
    <div className="tw-p-4 tw-bg-[#202020] tw-min-h-screen">
      <div className="tw-text-gray-400 tw-text-sm tw-flex tw-items-center tw-space-x-2 tw-mb-4">
        <Link to="/merchant/products" className="tw-flex tw-items-center tw-gap-1 hover:tw-text-white">
          <ArrowLeft size={16} /> <span>Products</span>
        </Link>
        <span>›</span>
        <span className="tw-text-white">{name}</span>
      </div>

      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-gap-4 tw-mb-6">
        <div className="tw-flex tw-items-center tw-gap-4">
          <img src={image} alt={name} className="tw-w-16 tw-h-16 tw-object-cover tw-rounded" />
          <div>
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
              <h1 className="tw-text-2xl tw-font-semibold tw-text-white">{name}</h1>
              <span className="tw-px-2 tw-py-1 tw-text-xs tw-bg-green-900 tw-text-green-300 tw-rounded">
                {status}
              </span>
            </div>
            <div className="tw-text-gray-400 tw-text-sm tw-space-y-1">
              <div className="tw-flex tw-items-center tw-gap-2">
                <span>Product Offer:</span>
                <div
                  role="switch"
                  aria-checked={offerOn}
                  tabIndex={0}
                  onClick={toggleOffer}
                  onKeyDown={onKey}
                  className="tw-relative tw-w-10 tw-h-5 tw-cursor-pointer tw-select-none"
                >
                  <span
                    className={
                      'tw-block tw-w-full tw-h-full tw-rounded-full tw-transition-colors ' +
                      (offerOn ? 'tw-bg-cyan-500' : 'tw-bg-gray-600')
                    }
                  />
                  <span
                    className={
                      'tw-absolute tw-top-0.5 tw-w-4 tw-h-4 tw-bg-white tw-rounded-full tw-shadow tw-transition-transform ' +
                      (offerOn ? 'tw-left-5' : 'tw-left-0.5')
                    }
                  />
                </div>
                <span className="tw-text-white tw-text-sm">{offerOn ? 'On' : 'Off'}</span>
              </div>
              <div>Reference ID: <span className="tw-text-white">{id}</span></div>
              <div>Variants: <span className="tw-text-white">{variants.length} variant{variants.length !== 1 && 's'}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-border-b tw-border-[#4c4c4c] tw-mb-6" />

      <section className="tw-border tw-border-[#4C4C4C] tw-rounded-lg">
        <div className="tw-px-4 tw-py-3 tw-border-b tw-border-[#4C4C4C]">
          <h2 className="tw-text-xl tw-font-medium tw-text-white">Product Info</h2>
        </div>
        <div className="tw-p-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Name</p>
            <p className="tw-text-white tw-text-sm">{name}</p>
          </div>
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Category</p>
            <p className="tw-text-white tw-text-sm">{category}</p>
          </div>
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Price</p>
            <p className="tw-text-white tw-text-sm">{currency} {price.toLocaleString()}</p>
          </div>
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Image URL</p>
            <p className="tw-text-blue-400 tw-text-sm break-all">{imageUrl}</p>
          </div>
          <div className="md:tw-col-span-2 lg:tw-col-span-3">
            <p className="tw-text-gray-400 tw-text-sm">Description</p>
            <div className="tw-text-white tw-text-sm" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </section>

      {/* Offer Info */}
      <section className="tw-mt-6 tw-border tw-border-[#4C4C4C] tw-rounded-lg">
        <div className="tw-px-4 tw-py-3 tw-border-b tw-border-[#4C4C4C]">
          <h2 className="tw-text-xl tw-font-medium tw-text-white">Offer Info</h2>
        </div>
        <div className="tw-p-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Status</p>
            <p className="tw-text-white tw-text-sm">{status}</p>
          </div>
          <div>
            <p className="tw-text-gray-400 tw-text-sm">Displayed</p>
            <p className="tw-text-white tw-text-sm">{offerOn ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="tw-mt-6 tw-border tw-border-[#4C4C4C] tw-rounded-lg">
        <div className="tw-px-4 tw-py-3 tw-border-b tw-border-[#4C4C4C]">
          <h2 className="tw-text-xl tw-font-medium tw-text-white">Plans</h2>
        </div>
        <div className="tw-p-6">
          <button onClick={() => console.log('Variants')} className="tw-flex tw-items-center tw-gap-1 tw-text-blue-400 hover:tw-text-blue-300">
            View variants <ExternalLink size={12} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
