import axios, { AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
    data: T;
    message?: string;
    errors?: string[];
}

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

function getErrorMessage(error: any): string {
    const responseData = error.response?.data;
    return (
        (Array.isArray(responseData?.errors)
            ? responseData.errors.join(', ')
            : '') ||
        responseData?.message ||
        'An error occured.'
    );
}

// GET
export async function apiGet<T>(
    url: string,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const resp = await api.get<ApiResponse<T>>(url, config);
        return resp.data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

// POST
export async function apiPost<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const resp = await api.post<ApiResponse<T>>(url, body, config);
        return resp.data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

// PUT
export async function apiPut<T>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const resp = await api.put<ApiResponse<T>>(url, body, config);
        return resp.data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

// DELETE
export async function apiDelete<T>(
    url: string,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const resp = await api.delete<ApiResponse<T>>(url, config);
        return resp.data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export default api;
