// src/services/productService.ts
import axiosInstance from './api'

// Raw types from the API
export interface ProtectionPlans {
  shipping: any
  "12m": any
  "24m": any
}

export interface ProductVariant {
  id: string
  merchant_id: string
  shopify_product_id: number
  variant_id: number
  title: string
  description: string
  handle: string
  price: number
  compare_at_price: number
  created_at: string
  updated_at: string
  status: string
  shipping_variant_id: string
  variant_12m_id: string
  variant_24m_id: string
  image_url: string
  category: string[]
  extended_active: boolean
  accidental_active: boolean
  shipping_active: boolean
  all_protection_active: boolean
  main_product_title: string
  v_title: string | null
  plans: ProtectionPlans
}

export interface Product {
  product_id: number
  variants: ProductVariant[]
}

interface RawGetProductsResponse {
  success: boolean
  productData: Product[]
  message?: string
}

interface RawToggleProtectionResponse {
  message: string
  updates: { id: string; newStatus: boolean }[]
}

export interface ProductList {
  id: string
  name: string
  product_id: number
  price: number
  imageUrl: string
  displayOffered: boolean
}

/** Fetch raw products from API */
export async function fetchRawProducts(): Promise<Product[]> {
  try {
    const response = await axiosInstance.get<RawGetProductsResponse>(
      '/api/merchant/getAllProducts'
    )
    if (!response.data.success) {
      throw new Error(response.data.message || 'API returned success=false')
    }
    return response.data.productData
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || 'Failed to fetch products'
    )
  }
}

/** Toggle protection on the backend */
export async function toggleProtection(
  productId: number
): Promise<boolean> {
  const resp = await axiosInstance.post<RawToggleProtectionResponse>(
    '/api/merchant/toggleProtection',
    { product_id: String(productId) }
  )
  return resp.data.updates[0].newStatus
}

/**
 * Map a raw ProductVariant + parent Product → ProductList
 */
function mapVariantToProductList(
  rawProduct: Product,
  variant: ProductVariant
): ProductList {
  return {
    id: variant.id,
    name:
      variant.v_title?.trim() ||
      variant.title?.trim() ||
      `Product ${rawProduct.product_id}`,
    product_id: rawProduct.product_id,
    price: variant.price,
    imageUrl: variant.image_url,
    displayOffered: variant.all_protection_active ?? false,
    // add more mapped fields if needed
  }
}

/**
 * Fetch and return ProductList[]
 */
export async function getProductList(): Promise<ProductList[]> {
  const rawProducts = await fetchRawProducts()
  const list: ProductList[] = rawProducts.flatMap((rp) =>
    (rp.variants || []).map((variant) =>
      mapVariantToProductList(rp, variant)
    )
  )
  return list
}
