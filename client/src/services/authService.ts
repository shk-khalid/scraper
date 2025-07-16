import axiosInstance from './api';

type ApiResp = { success: boolean; message?: string; [key: string]: any };

export async function signIn(
  email: string,
  password: string
): Promise<{ data: ApiResp; error: Error | null }> {
  try {
    const endpoint = '/api/auth/loginMerchant';
    const { data } = await axiosInstance.post<ApiResp>(endpoint, { email, password });

    if (!data.success) throw new Error(data.message || 'Login failed');

    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { data: { success: false, message: error.message }, error };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    await axiosInstance.get('/api/auth/logout');
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function requestPasswordOTP(
  email: string
): Promise<{ data: ApiResp | null; error: Error | null }> {
  try {
    const endpoint = '/api/auth/MresetPasswordOTP';
    const { data } = await axiosInstance.post<ApiResp>(endpoint, { email });

    if (data.success === false) {
      return { data: null, error: new Error(data.message || 'OTP request failed') };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error requesting password OTP:', error);
    return { data: null, error: new Error(error.message) };
  }
}

export async function resetPassword(
  email: string,
  newPassword: string,
  otp: string
): Promise<{ data: ApiResp | null; error: Error | null }> {
  try {
    const endpoint = '/api/auth/MresetPassword';
    const payload = { email, newPassword, otp };
    const { data } = await axiosInstance.post<ApiResp>(endpoint, payload);

    if (data.success === false) {
      return { data: null, error: new Error(data.message || 'Password reset failed') };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return { data: null, error: new Error(error.message) };
  }
}
