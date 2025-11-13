import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api';
import { AxiosRequestConfig } from 'axios';

/**
 * Hook to make authenticated admin API calls
 * Automatically adds Authorization header with access token
 */
export const useAdminApi = () => {
  const { accessToken } = useAuth();

  const get = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const del = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
};
