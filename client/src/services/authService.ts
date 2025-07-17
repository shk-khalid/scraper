import axiosInstance from './api';

export type ApiResp<T = {}> = T & {
  message: string;
};

export async function signIn(
  email: string,
  password: string
): Promise<{ message: string; user_email: string; error: Error | null }> {
  try {
    const { data, status } = await axiosInstance.post<
      ApiResp<{ user_email: string }>
    >(
      '/api/login/',
      { email, password },
      { withCredentials: true }
    );

    if (status !== 200) {
      throw new Error(data.message || 'Login failed');
    }

    return { message: data.message, user_email: data.user_email, error: null };
  } catch (err: any) {
    console.error('Error signing in:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unknown login error';
    return { message: msg, user_email: '', error: err };
  }
}

export async function register(
  email: string,
  password: string
): Promise<{ message: string; error: Error | null }> {
  try {
    const { data, status } = await axiosInstance.post<
      ApiResp
    >(
      '/api/register/',
      { email, password },
      { withCredentials: true }
    );

    if (![201, 202].includes(status)) {
      throw new Error(data.message || 'Registration failed');
    }

    return { message: data.message, error: null };
  } catch (err: any) {
    console.error('Error registering:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unknown registration error';
    return { message: msg, error: err };
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ message: string; error: Error | null }> {
  try {
    const { data, status } = await axiosInstance.post<
      ApiResp
    >(
      '/api/forgot/',
      { email },
      { withCredentials: true }
    );

    if (status !== 200) {
      throw new Error(data.message || 'Password reset request failed');
    }

    return { message: data.message, error: null };
  } catch (err: any) {
    console.error('Error requesting password reset:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unknown error';
    return { message: msg, error: err };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    await axiosInstance.post(
      '/api/logout/',
      {},
      { withCredentials: true }
    );
    return { error: null };
  } catch (err: any) {
    console.error('Error signing out:', err);
    return { error: err };
  }
}


export async function signInWithGoogle(
  providerToken: string
): Promise<{ message: string; user_email: string; error: Error | null }> {
  try {
    const { data, status } = await axiosInstance.post<
      ApiResp<{ user_email: string }>
    >(
      '/api/google/',
      { provider_token: providerToken },
      { withCredentials: true }
    );

    if (status !== 200) {
      throw new Error(data.message || 'Google login failed');
    }

    return { message: data.message, user_email: data.user_email, error: null };
  } catch (err: any) {
    console.error('Error signing in with Google:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unknown Google login error';
    return { message: msg, user_email: '', error: err };
  }
}