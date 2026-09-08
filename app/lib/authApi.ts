import apiClient from "./apiClients";
import { AxiosError } from "axios";

// interface for API response structure

interface ApiResponse<T>{
    data: T;
    meta:{
        timestamp: string;
        pagination?: {
            limit: number;
            offset: number;
            total_count: number;
            has_more: boolean;
            returned_count: number;
        };
    };
}

// Error response structure from backend
interface ApiErrorResponse {
    message?: string;
    detail?: Array<{ msg: string }> | string;
}

// data type

interface UserData{
    id: number;
    email: string;
    name?: string;
}

// auth api function

export const authApi = {

    // Register

    register: async(email: string, password: string, name?: string): Promise<UserData> => {
        try {
            const payload = {
                email,
                password,
                ...(name && { name })
            };
            const response = await apiClient.post<ApiResponse<UserData>>(
                '/auth/register',
                payload
            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[REGISTER ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },


    // login

    login: async(email: string, password: string): Promise<UserData> => {
        try {
            const payload = {
                email,
                password
            };
            const response = await apiClient.post<ApiResponse<UserData>>(
                '/auth/login',
                payload
            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[LOGIN ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },


    // refresh token

    refresh: async(): Promise<UserData> =>{
        try {
            const response = await apiClient.post<ApiResponse<UserData>>(
                '/auth/refresh'
            );
            return response.data.data;
        } catch (error) {
            console.error('[REFRESH ERROR]', error);
            throw error;
        }
    },

    // get current authenticated user
    // Note: 401 errors are expected when user is not logged in - don't log them as errors

    me: async(): Promise<UserData> =>{
        try {
            const response = await apiClient.get<ApiResponse<UserData>>(
                '/auth/me'
            );
            return response.data.data;
        } catch (error) {
            // Don't log 401 errors - they're expected when not authenticated
            const axiosError = error as AxiosError<ApiErrorResponse>;
            if (axiosError.response?.status !== 401) {
                console.error('[GET ME ERROR]', error);
            }
            throw error;
        }
    },


    // logout

    logout: async(): Promise<void> =>{
        try {
            const response = await apiClient.post<ApiResponse<{ message: string }>>(
                '/auth/logout'
            );
            console.log('[LOGOUT SUCCESS]', response.data.data.message);
        } catch (error) {
            console.error('[LOGOUT ERROR]', error);
            throw error;
        }
    },

    // forgot password - send OTP to email

    forgotPassword: async(email: string): Promise<{ message: string }> => {
        try {
            const response = await apiClient.post<ApiResponse<{ message: string }>>(
                '/auth/forgot-password',
                { email }
            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[FORGOT PASSWORD ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },

    // verify OTP - returns reset_token

    verifyOtp: async(email: string, otp: string): Promise<{ reset_token: string }> => {
        try {
            const response = await apiClient.post<ApiResponse<{ reset_token: string }>>(
                '/auth/verify-otp',
                { email, otp }
            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[VERIFY OTP ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    },

    // reset password - set new password using reset_token

    resetPassword: async(email: string, resetToken: string, newPassword: string): Promise<{ message: string }> => {
        try {
            const response = await apiClient.post<ApiResponse<{ message: string }>>(
                '/auth/reset-password',
                { email, reset_token: resetToken, new_password: newPassword }
            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            console.error('[RESET PASSWORD ERROR]', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            throw error;
        }
    }
}