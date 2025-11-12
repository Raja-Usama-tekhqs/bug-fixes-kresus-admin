import { UseQueryOptions } from "react-query";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ApiClient = {
    useGetRequest: <T>(
        URL: string,
        key?: string, // Optional key
        options?: UseQueryOptions<T>, // Options are optional
    ) => ReturnType<any>;
    postRequest: <T>(URL: string, payload: unknown) => Promise<T>;
    putRequest: <T>(URL: string, payload: unknown) => Promise<T>;
    patchRequest: <T>(URL: string, payload: unknown) => Promise<T>;
    deleteRequest: <T>(URL: string) => Promise<T>;
    postRequestFormData: <T>(URL: string, payload: Record<string, any>) => Promise<T>;
    putRequestFormData: <T>(URL: string, payload: Record<string, any>) => Promise<T>;
    useGetRequestAuth: (URL: string, key: string, options?: object) => ReturnType<any>;
    postRequestAuth: (URL: string, payload: any) => Promise<any>;
    getRequest: <T>(URL: string, params: Record<string, any>) => Promise<T>;
}
export type { ApiClient };
