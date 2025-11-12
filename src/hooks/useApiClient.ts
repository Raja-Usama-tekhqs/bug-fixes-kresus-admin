/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToken } from 'store/slices';
import { ApiClient } from 'type/clientType';

const useApiClient = (): ApiClient => {
    // const token = useSelector((state: RootState) => state.states.token);
    
    const token = import.meta.env.VITE_REACT_APPLICATION_KRESUS_TOKEN
    const dispatch = useDispatch();

    const axiosClient: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_REACT_APPLICATION_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'X-API-KEY': import.meta.env.VITE_REACT_APPLICATION_KRESUS_TOKEN,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
    });
    const axiosAuth = axios.create({
        baseURL: import.meta.env.VITE_REACT_APPLICATION_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'X-API-KEY': import.meta.env.VITE_REACT_APPLICATION_KRESUS_TOKEN,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
    });

    let isSessionExpired = false;

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (
                error.response &&
                (error.response.status === 401 || error.response.status === 403)
            ) {
                if (!isSessionExpired) {
                    isSessionExpired = true;
                    dispatch(setToken(''));
                }
                return Promise.reject(new Error('Session Expired'));
            }
            return Promise.reject(error);
        }
    );

    const fetcherAuth = async (URL: string) => {
        const response = await axiosAuth.get(URL);
        return response.data;
    };

    const useGetRequestAuth = (URL: string, key: string, options: object = {}) => {
        return useQuery([key ?? URL, URL], () => fetcherAuth(URL), options);
    };

    const useGetRequest = (
        URL: string,
        key?: string, // Optional
        options: object = {},
    ): {
        data: any | undefined; isLoading: boolean; error: any
    } => {
        return useQuery<any>(
            [key ?? URL, URL],
            () => axiosClient.get(URL).then((res) => res.data),
            options
        );
    };

    const postRequestAuth = async (URL: string, payload: any) => {
        try {
            const response = await axiosAuth.post(URL, payload);
            return response.data;
        } catch (error) {
            console.error('Post Request Error:', error);
            throw error;
        }
    };

    const postRequest = async <T>(URL: string, payload: unknown): Promise<T> => {
        const response = await axiosClient.post<T>(URL, payload);
        return response.data;
    };

    const patchRequest = async <T>(URL: string, payload: unknown): Promise<T> => {
        const response = await axiosClient.patch<T>(URL, payload);
        return response.data;
    };

    const putRequest = async <T>(URL: string, payload: unknown): Promise<T> => {
        const response = await axiosClient.put<T>(URL, payload);
        return response.data;
    };

    const deleteRequest = async <T>(URL: string): Promise<T> => {
        const response = await axiosClient.delete<T>(URL);
        return response.data;
    };

    const postRequestFormData = async <T>(
        URL: string,
        payload: Record<string, any>
    ): Promise<T> => {
        const formData = new FormData();
        for (const key in payload) {
            if (Array.isArray(payload[key])) {
                (payload[key] as File[]).forEach((file: File) => {
                    formData.append(key, file);
                });
            } else if (payload[key] != null) {
                formData.append(key, payload[key]);
            }
        }

        const response = await axiosClient.post<T>(URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    };

    const putRequestFormData = async <T>(
        URL: string,
        payload: Record<string, any>
    ): Promise<T> => {
        const formData = new FormData();
        for (const key in payload) {
            if (Array.isArray(payload[key])) {
                (payload[key] as File[]).forEach((file: File) => {
                    formData.append(key, file);
                });
            } else if (payload[key] != null) {
                formData.append(key, payload[key]);
            }
        }

        const response = await axiosClient.put<T>(URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    };

    const getRequest = async <T>(
        url: string,
        params: Record<string, any> = {},    
    ): Promise<T> => {
        const response = await axiosClient.get<T>(url, {
            params
        } as AxiosRequestConfig);
        return response.data;
    };

      
    return {
        getRequest,
        useGetRequest,
        postRequest,
        putRequest,
        patchRequest,
        putRequestFormData,
        deleteRequest,
        postRequestFormData,
        useGetRequestAuth,
        postRequestAuth
    };
};

export default useApiClient;