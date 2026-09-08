'use client';

import React, {createContext, useContext, useState, ReactNode, useEffect, useRef} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/app/lib/authApi";
import { AxiosError } from "axios";

interface User{
    id: number;
    email: string;
    name?: string;
}

interface AuthContextType{

    // states variables
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitializing: boolean; // true while checking session on app load
    error: string | null;

    // functions
    register: (email: string, password: string, name?: string) => Promise<void>;
    login:(email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Error response structure from backend
interface ApiErrorResponse {
    message?: string;
    detail?: Array<{ msg: string }> | string;
}

// creating auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// custom hook to use auth context
// this allow any component to access auth state and functions

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// AuthProvider component to wrap the application in app/layout.tsx

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const router = useRouter();
    const pathname = usePathname();
    const prevPathnameRef = useRef(pathname);
    const isMountedRef = useRef(true); // Track if component is mounted to prevent state updates after unmount

    // auth states variables

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true); // true while checking session on app load
    const [isNavigating, setIsNavigating] = useState<boolean>(false); // true after successful auth, during navigation
    const [error, setError] = useState<string | null>(null);


    // user is authenticated if user state is not null
    const isAuthenticated  = user !== null;

    // Track mounted state for cleanup
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Check for existing session on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get current user from /auth/me endpoint
                const userData = await authApi.me();
                if (isMountedRef.current) {
                    setUser(userData);
                }
            } catch {
                // User not authenticated
                if (isMountedRef.current) {
                    setUser(null);
                }
            } finally {
                if (isMountedRef.current) {
                    setIsInitializing(false);
                }
            }
        };
        initializeAuth();
    }, []);

    // Note: Route protection is handled by ClientLayoutWrapper
    // AuthProvider only manages auth state, not redirects

    // Clear auth errors and navigation state when route changes
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            setError(null);
            setIsNavigating(false);
            prevPathnameRef.current = pathname;
        }
    }, [pathname]);

    // register

    const register = async(email: string, password: string, name?: string) => {
        try {
            // clear previous errors and set loading state
            setError(null);
            setIsLoading(true);

            // call api to register user with email, password, and optional name
            const userData = await authApi.register(email, password, name);
            setUser(userData);
            setIsLoading(false);
            setIsNavigating(true);
            router.replace('/chat');
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            let errorMessage = 'Registration failed. Please try again.';

            if(axiosError.response?.status === 422){
                const detail = axiosError.response.data?.detail;
                if(Array.isArray(detail) && detail.length > 0){
                    errorMessage = detail[0].msg || 'Validation failed.';
                }
            }
            else if (axiosError.response?.status === 400){
                errorMessage = axiosError.response.data?.message || 'Bad request';
            }
            else if(!axiosError.response){
                errorMessage = 'Network error. Please check your connection.';
            }
            else if(axiosError.response?.status >= 500){
                errorMessage = 'Server error. Please try again later.';
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // login

    const login = async(email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            // call api to login user
            const userData = await authApi.login(email, password);

            setUser(userData);
            setIsLoading(false);
            setIsNavigating(true);
            router.replace('/chat');
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            let errorMessage = 'Login failed. Please try again.';

            if(axiosError.response?.status === 422){
                const detail = axiosError.response.data?.detail;
                if(Array.isArray(detail) && detail.length > 0){
                    errorMessage = detail[0].msg || 'Validation failed.';
                }
            }
            else if(axiosError.response?.status === 401){
                errorMessage = 'Invalid email or password.';
            }
            else if(axiosError.response?.status === 400){
                errorMessage = axiosError.response.data?.message || 'Bad request';
            }
            else if(!axiosError.response){
                errorMessage = 'Network error. Please check your connection.';
            }
            else if(axiosError.response?.status >= 500){
                errorMessage = 'Server error. Please try again later.';
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // logout

    const logout = async () => {
        try {
            setError(null);
            // call backend logout endpoint
            await authApi.logout();
        } catch (err) {
            console.error('Logout error:', err);
            // continue logout even if API call fails
        } finally {
            // clear auth state regardless of API response
            setUser(null);
            // redirect to signin page
            router.push('/auth/signin');
        }
    };

    // clear error
    
    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        isInitializing,
        error,
        register,
        login,
        logout,
        clearError
    };

    // Show loading spinner while checking session on initial load
    if (isInitializing) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1DAF61] rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Show loading spinner during navigation after successful login/register
    if (isNavigating) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1DAF61] rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">Signing in...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}