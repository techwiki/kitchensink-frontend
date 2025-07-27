'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    login: () => {},
    logout: () => {},
});

interface JwtPayload {
    sub: string;
    role: string;
    exp: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const decodeToken = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64)) as JwtPayload;
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const isTokenExpired = (token: string): boolean => {
        const payload = decodeToken(token);
        if (!payload) return true;
        return payload.exp * 1000 < Date.now();
    };

    const processToken = (newToken: string | null) => {
        if (!newToken) {
            setIsAdmin(false);
            return;
        }

        const payload = decodeToken(newToken);
        if (payload) {
            setIsAdmin(payload.role === 'ROLE_ADMIN');
        }
    };

    useEffect(() => {
        // Check for token in localStorage on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken && !isTokenExpired(storedToken)) {
            setToken(storedToken);
            processToken(storedToken);
        } else if (storedToken) {
            // Token exists but is expired
            localStorage.removeItem('token');
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        processToken(newToken);
        
        // Redirect based on role
        const payload = decodeToken(newToken);
        if (payload) {
            const isAdmin = payload.role === 'ROLE_ADMIN';
            router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAdmin(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated: !!token,
            isAdmin,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 