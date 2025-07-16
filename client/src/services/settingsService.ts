// src/services/settingService.ts
import axiosInstance from './api';

export interface BankDetailsPayload {
  User_id: string;
  bank_details: {
    name: string;
    accNo: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// Types for merchant plans
export interface MerchantActivePlansResponse {
  allowed_plans: {
    extended: boolean;
    shipping: boolean;
    accidental: boolean;
  };
  active_plans: {
    extended: boolean;
    shipping: boolean;
    accidental: boolean;
  };
}

export interface TogglePlansData {
  extended: boolean;
  shipping: boolean;
  accidental: boolean;
}

/**
 * Fetch initial state of protection plans for the merchant.
 * GET /api/merchant/getMerchnatActivePlans
 */
export async function getMerchantActivePlans(): Promise<ApiResponse<MerchantActivePlansResponse>> {
  try {
    const resp = await axiosInstance.get<ApiResponse<MerchantActivePlansResponse>>(
      '/api/merchant/getMerchnatActivePlans'
    );
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Failed to fetch merchant active plans');
    }
    return resp.data;
  } catch (error: any) {
    console.error('[getMerchantActivePlans] oops:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch merchant active plans'
    );
  }
}

/**
 * Toggle extended protection for all products.
 * GET /api/merchant/enableDisableExtendedProtectionForAll
 */
export async function enableDisableExtendedProtectionForAll(): Promise<ApiResponse<TogglePlansData>> {
  try {
    const resp = await axiosInstance.get<ApiResponse<TogglePlansData>>(
      '/api/merchant/enableDisableExtendedProtectionForAll'
    );
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Server refused to toggle extended protection');
    }
    return resp.data;
  } catch (error: any) {
    console.error('[enableDisableExtendedProtectionForAll] oops:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to toggle extended protection'
    );
  }
}

/**
 * Toggle shipping protection for all products.
 * GET /api/merchant/enableDisableShippingForAll
 */
export async function enableDisableShippingForAll(): Promise<ApiResponse<TogglePlansData>> {
  try {
    const resp = await axiosInstance.get<ApiResponse<TogglePlansData>>(
      '/api/merchant/enableDisableShippingForAll'
    );
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Server refused to toggle shipping protection');
    }
    return resp.data;
  } catch (error: any) {
    console.error('[enableDisableShippingForAll] oops:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to toggle shipping protection'
    );
  }
}

/**
 * Toggle accidental protection for all products.
 * GET /api/merchant/enableDisableAccidentalForAll
 */
export async function enableDisableAccidentalForAll(): Promise<ApiResponse<TogglePlansData>> {
  try {
    const resp = await axiosInstance.get<ApiResponse<TogglePlansData>>(
      '/api/merchant/enableDisableAccidentalForAll'
    );
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Server refused to toggle accidental protection');
    }
    return resp.data;
  } catch (error: any) {
    console.error('[enableDisableAccidentalForAll] oops:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to toggle accidental protection'
    );
  }
}

// Existing function for bank details
export async function updateBankDetails(
  userId: string,
  name: string,
  accNo: string
): Promise<ApiResponse> {
  const payload: BankDetailsPayload = {
    User_id: userId,
    bank_details: { name, accNo },
  };

  try {
    const resp = await axiosInstance.post<ApiResponse>(
      '/api/merchant/updateBankDetails',
      payload
    );
    if (!resp.data.success) {
      throw new Error(resp.data.message || 'Server refused to cooperate');
    }
    return resp.data;
  } catch (error: any) {
    console.error('[updateBankDetails] oops:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to update bank details'
    );
  }
}
