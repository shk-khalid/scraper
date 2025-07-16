import axiosInstance from './api';

export interface ScrapeResponse {
  message: string;
  user_email: string;
  data: string[];
}

export async function scrape(
  url: string,
  selector: string
): Promise<{ response: ScrapeResponse | null; error: Error | null }> {
  try {
    const { data, status } = await axiosInstance.post<ScrapeResponse>(
      '/api/scrape/',
      { url, selector },
      { withCredentials: true }
    );

    if (status !== 200) {
      throw new Error(data.message || 'Scrape failed');
    }

    return { response: data, error: null };
  } catch (err: any) {
    console.error('Error scraping:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unknown scraping error';
    return {
      response: null,
      error: new Error(msg),
    };
  }
}
