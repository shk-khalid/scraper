import axiosInstance from './api'

/**  
 * Raw shape of a claim from the API  
 */
interface RawClaim {
  id: string;
  claim_type: string;
  policy_id: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_id: string;
  damage: string[] | null;
  status: string;
  description: string | null;
  incident_date?: string;
}

/**  
 * Raw response wrapper from GET /api/merchant/getClaims  
 */
interface RawGetClaimsResponse {
  sucess: boolean;   // yup, with that typo
  data: RawClaim[];
  message: string;
}

/**  
 * UI‐friendly claim shape  
 */
export interface Claim {
  type: string;
  contractId: string;
  claimId: string;
  customerName: string;
  customerEmail: string;
  failureType: string;
  incidentDate: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

/**
 * Fetches and **normalizes** all insurance claims for a merchant.
 * @param merchantId — the merchant’s UUID
 * @returns Promise<Claim[]> 
 */
export async function getClaims(merchantId: string): Promise<Claim[]> {
  if (!merchantId) {
    return Promise.reject(new Error('Missing merchantId'));
  }

  try {
    const resp = await axiosInstance.get<RawGetClaimsResponse>(
      '/api/merchant/getClaims',
      { data: { User_id: merchantId } }
    );
    const { sucess, data, message } = resp.data;
    if (!sucess) {
      throw new Error(message || 'API returned sucess=false');
    }

    return data.map(rc => {
      let failure: string;
      if (Array.isArray(rc.damage)) failure = rc.damage.join(', ');
      else if (rc.damage == null) failure = '';
      else failure = String(rc.damage);

      const incidentIso = rc.incident_date ?? rc.created_at;

      const status = ['Pending', 'Approved', 'Denied'].includes(rc.status)
        ? (rc.status as 'Pending' | 'Approved' | 'Denied')
        : 'Pending';

      return {
        type: rc.claim_type,
        contractId: rc.customer_id,
        claimId: rc.id,
        customerName: rc.customer_name ?? '',
        customerEmail: rc.customer_email ?? '',
        failureType: failure,
        incidentDate: incidentIso,
        status,
      };
    });
  } catch (err: any) {
    if (err.response) {
      const msg = typeof err.response.data?.message === 'string'
        ? err.response.data.message
        : `Server returned ${err.response.status}`;
      return Promise.reject(new Error(msg));
    } else if (err.request) {
      return Promise.reject(new Error('No response from server'));
    }
    return Promise.reject(new Error(err.message || 'Unknown fetch error'));
  }
}


/**  
 * Raw shape of the detailed claim response from the API  
 */
interface RawClaimDetailResponse {
  success: boolean;
  data: RawClaimDetail;
  message?: string;
}

interface RawClaimDetail {
  id: string;
  policy_id: string;
  merchant_id: string;
  plan_id: string;
  claim_type: string;
  description: string | null;
  evidence_urls: string[];
  amount_claimed: number | null;
  payout_amount: number | null;
  deductible_applied: number | null;
  status: string;
  status_notes: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  processed_at: string | null;
  customer_id: string;
  product_id: string;
  ai_confidence: string | null;
  ai_summary: string | null;
  submitted: boolean;
  damage: string[];
  what_to_do: string | null;
  customer_name: string | null;
  customer_email: string | null;
  high_priority: boolean;
  product: {
    title: string;
    main_product_title: string;
    sku: string | null;
    variant_id: number;
    price: number;
  };
  customer: {
    full_name: string;
    email: string;
    phone: string | null;
    address: {
      address1: string;
      city: string;
      province: string;
      zip: string;
      country: string;
    };
  };
}

import {
  ClaimDetails,
  CustomerInfo,
  ClaimInfo,
  ProductInfo,
  ServiceOrderInfo,
} from '@/types'

/**
 * Fetches and **normalizes** a single claim detail.
 * @param claimId — the claim’s UUID
 * @returns Promise<ClaimDetails>
 */
export async function getClaimsDetail(
  claimId: string
): Promise<ClaimDetails> {
  if (!claimId) {
    return Promise.reject(new Error('Missing claimId'));
  }

  try {
    const resp = await axiosInstance.post<RawClaimDetailResponse>(
      '/api/merchant/getClaimDetails',
      { claim_id: claimId }
    );
    const { success, data, message } = resp.data;

    if (!success) {
      throw new Error(message || 'API returned success=false');
    }

    // Map customer
    const customerInfo: CustomerInfo = {
      fullName: data.customer.full_name,
      phone: data.customer.phone ?? '',
      email: data.customer.email,
      address: [
        data.customer.address.address1,
        data.customer.address.city,
        data.customer.address.province,
        data.customer.address.zip,
        data.customer.address.country,
      ].filter(Boolean).join('  '),
    };

    // Map claim
    const claimInfo: ClaimInfo = {
      type: data.claim_type,
      statusDetail: data.status_notes ?? data.status,
      incidentDescription: data.description ?? '',
      fraudulentActivity: data.what_to_do ?? '',
      storeName: data.customer.address.city,
      poNumber: data.plan_id,
      storeId: data.merchant_id,
      coverageYears: `${new Date(data.created_at).getFullYear()}`,
      coverageTerm: data.reviewed_at
        ? `${new Date(data.created_at).toLocaleDateString()} - ${new Date(data.reviewed_at).toLocaleDateString()}`
        : '',
    };

    // Map product
    const productInfo: ProductInfo = {
      name: data.product.title,
      manufacturer: data.product.main_product_title,
      modelNumber: data.product.sku ?? undefined,
      serialNumber: String(data.product.variant_id),
    };

    // Map service order
    const fmtCurrency = (amt: number | null) =>
      amt != null ? `₹ ${amt.toLocaleString()}` : '––';
    const serviceOrderInfo: ServiceOrderInfo = {
      serviceOrderId: data.id,
      serviceType: data.claim_type,
      status: data.status_notes ?? data.status,
      assignee: data.high_priority ? 'High Priority' : 'Standard',
      remainingCoverage: fmtCurrency(data.deductible_applied),
      productListPrice: fmtCurrency(data.product.price),
      defectiveShippingStatus: undefined,
      defectiveCarrier: undefined,
      trackingNumber: undefined,
    };

    // Final shape
    const claimDetails: ClaimDetails = {
      claimId: data.id,
      contractId: data.policy_id,
      product: data.product.title,
      type: data.claim_type,
      status:
        data.status.toLowerCase() === 'approved'
          ? 'Approved'
          : data.status.toLowerCase() === 'declined'
            ? 'Denied'
            : 'In Review',
      customerInfo,
      claimInfo,
      productInfo,
      serviceOrderInfo,
    };

    return claimDetails;
  } catch (err: any) {
    if (err.response) {
      const msg = typeof err.response.data?.message === 'string'
        ? err.response.data.message
        : `Server returned ${err.response.status}`;
      return Promise.reject(new Error(msg));
    } else if (err.request) {
      return Promise.reject(new Error('No response from server'));
    }
    return Promise.reject(new Error(err.message || 'Unknown fetch error'));
  }
}
