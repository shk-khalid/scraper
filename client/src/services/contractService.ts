import axiosInstance from './api'
import {
  ContractDetails,
  FormData,
  TransactionInformation,
  StoreInformation,
  ContractInformation,
  Shipment,
  Product
} from '@/types'


function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

/**  
 * Inlined mapper: turns the raw API payload into our ContractDetails shape  
 */
function mapToContractDetails(resp: {
  data: {
    policyInfo: {
      id: string
      policy_number: string
      insurer_id: string
      order_id: string
      purchase_channel: string
      start_date: string
      end_date: string
      status: string
      Customer_ID: string
      policy_type: string
    }
    customer: {
      full_name: string
      email: string
      phone: string
      address: {
        zip: string
        city: string
        name: string
        phone: string | null
        company: string | null
        country: string
        address1: string
        address2: string | null
        latitude: number
        province: string
        last_name: string
        longitude: number
        first_name: string
        country_code: string
        province_code: string
      }
    }
    merchant: {
      id: string
      name: string
      shop_url: string
    }
  }
}): ContractDetails {
  const { policyInfo, customer, merchant } = resp.data

  const formData: FormData = {
    customerId: policyInfo.Customer_ID,
    fullName: customer.full_name,
    phoneNumber: customer.phone,
    email: customer.email,
    address: customer.address.address1,
    address2: customer.address.address2 ?? '',
    city: customer.address.city,
    state: customer.address.province,
    pinCode: customer.address.zip,
    country: customer.address.country,
    // Mirror billing into shipping by default:
    shippingAddress: customer.address.address1,
    shippingAddress2: customer.address.address2 ?? '',
    shippingCity: customer.address.city,
    shippingState: customer.address.province,
    shippingPinCode: customer.address.zip,
    shippingCountry: customer.address.country
  }

  const transactionInfo: TransactionInformation = {
    transactionId: policyInfo.policy_number,
    currencyCode: 'INR',
  }

  const storeInfo: StoreInformation = {
    storeName: merchant.name,
    storeId: merchant.id
  }

  const contractInfo: ContractInformation = {
    contractId: policyInfo.id,
    status: policyInfo.status,
    planId: undefined,
    dateUpdated: formatDate(policyInfo.start_date),
    purchasePrice: '',
    planCategory: policyInfo.policy_type,
    transactionDate: formatDate(policyInfo.start_date),
    dateRefunded: '--',
    dateCanceled: '--',
    planTransactionId: undefined
  }

  const shipments: Shipment[] = []
  const unassignedProducts: Product[] = []

  return {
    formData,
    transactionInfo,
    storeInfo,
    contractInfo,
    shipments,
    unassignedProducts
  }
}

export interface Contract {
  transactionId: string
  contractId: string
  status: string
  type: string
  date: string
  customerName: string
  customerEmail: string
  productName: string
  price: number
}

interface RawContract {
  policy: {
    id: string
    policy_number: string
    status: string
    type: string
    start_date: string
    end_date: string
    premium_amount: number
    sum_insured: number
    purchase_channel: string | null
    created_at: string
    certificate_url: string | null
  }
  customer: {
    id: string
    full_name: string
    email: string
    phone: string
    address: {
      zip: string
      city: string
      name: string
      phone: string | null
      company: string | null
      country: string
      address1: string
      address2: string | null
      latitude: number
      province: string
      last_name: string
      longitude: number
      first_name: string
      country_code: string
      province_code: string
    }
  }
  product: {
    id: string
    title: string
    description: string
    image_url: string
    price: number
    category: any[]
    handle: string
    extended_active: boolean
    accidental_active: boolean
    shipping_active: boolean
  }
}

interface GetContractsResponse {
  success: boolean
  data: RawContract[]
}

/** Fetch the list of all contracts **/
export async function getContracts(): Promise<Contract[]> {
  try {
    const response = await axiosInstance.get<GetContractsResponse>(
      '/api/merchant/getContracts'
    )

    if (!response.data.success) {
      throw new Error('API returned success=false')
    }

    return response.data.data.map((item) => ({
      transactionId: item.policy.policy_number,
      contractId: item.policy.id,
      status: item.policy.status,
      type: item.policy.type,
      date: item.policy.created_at,
      customerId: item.customer.id,
      customerName: item.customer.full_name,
      customerEmail: item.customer.email,
      productName: item.product.title,
      price: item.product.price,
    }))
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch contracts'
    )
  }
}


/** 👀 DETAIL VIEW **/

interface RawContractDetailsResponse {
  success: boolean
  data: {
    policyInfo: {
      id: string
      policy_number: string
      insurer_id: string
      order_id: string
      purchase_channel: string
      start_date: string
      end_date: string
      status: string
      Customer_ID: string
      policy_type: string
    }
    customer: {
      full_name: string
      email: string
      phone: string
      address: {
        zip: string
        city: string
        name: string
        phone: string | null
        company: string | null
        country: string
        address1: string
        address2: string | null
        latitude: number
        province: string
        last_name: string
        longitude: number
        first_name: string
        country_code: string
        province_code: string
      }
    }
    merchant: {
      id: string
      name: string
      shop_url: string
    }
  }
  message?: string
}

/** Fetch the details for a single contract **/
export async function getContractDetails(
  id: string
): Promise<ContractDetails> {
  try {
    const resp = await axiosInstance.post<RawContractDetailsResponse>(
      '/api/merchant/getContractDetails',
      { policy_id: id }
    )

    if (!resp.data.success) {
      throw new Error('API returned success=false')
    }

    // Inline mapping:
    return mapToContractDetails(resp.data)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch contract details'
    )
  }
}

export interface EditContractDetailsRequest {
  customer_id: string
  policy_id: string
  User_id: string
  customer_data: {
    full_name: string
    email: string
    phone: string
  }
  address: {
    zip: string
    city: string
    name: string
    phone: string | null
    company: string | null
    country: string
    address1: string
    address2: string | null
    latitude: number
    province: string
    last_name: string
    longitude: number
    first_name: string
    country_code: string
    province_code: string
  }
}
interface RawEditContractDetailsResponse {
  success: boolean
  data: any  // we don’t know exact shape until we inspect; could be full contract detail or partial
  message?: string
}

/**
 * editContractDetails: Attempts to post the edit payload and map the response into ContractDetails.
 * If the response shape is not full (so mapToContractDetails throws), and if existingDetail is provided,
 * it will merge only the edited fields (formData) into the existingDetail and return that.
 * Otherwise it throws an error.
 *
 * IMPORTANT: Pass the current detail into existingDetail from the component, so fallback merging is possible.
 */
export async function editContractDetails(
  payload: EditContractDetailsRequest,
  existingDetail?: ContractDetails
): Promise<ContractDetails> {
  // Log payload for debugging if desired:
  console.debug('[editContractDetails] payload:', payload)

  const resp = await axiosInstance.post<RawEditContractDetailsResponse>(
    '/api/merchant/editContractDetails',
    payload
  )

  console.debug('[editContractDetails] raw response:', resp.data)

  if (!resp.data.success) {
    throw new Error(resp.data.message || 'API returned success=false')
  }

  const data = resp.data.data
  // Try mapping full detail
  try {
    // If data matches expected shape (policyInfo, customer, merchant), this will succeed.
    return mapToContractDetails(data)
  } catch (mapErr) {
    console.warn(
      '[editContractDetails] mapToContractDetails failed – response shape may be partial:',
      mapErr
    )
    // Fallback: if we have existingDetail, merge only the edited formData fields
    if (existingDetail) {
      // Merge only fields we know were edited: full_name, email, phone, address fields
      const mergedFormData: FormData = {
        ...existingDetail.formData,
        fullName: payload.customer_data.full_name,
        email: payload.customer_data.email,
        phoneNumber: payload.customer_data.phone,
        address: payload.address.address1,
        address2: payload.address.address2 ?? '',
        city: payload.address.city,
        state: payload.address.province,
        pinCode: payload.address.zip,
        country: payload.address.country,
        // For shipping fields: if previously shippingSame was true we mirrored; here assume shipping separate
        shippingAddress: existingDetail.formData.shippingAddress,
        shippingAddress2: existingDetail.formData.shippingAddress2,
        shippingCity: existingDetail.formData.shippingCity,
        shippingState: existingDetail.formData.shippingState,
        shippingPinCode: existingDetail.formData.shippingPinCode,
        shippingCountry: existingDetail.formData.shippingCountry,
      }
      return {
        ...existingDetail,
        formData: mergedFormData,
      }
    } else {
      throw new Error(
        'Failed to map updated contract details and no existing detail to fallback on'
      )
    }
  }
}
