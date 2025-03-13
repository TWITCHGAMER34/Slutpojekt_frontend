import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export interface User {
    id: string;
    usernamename: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    DOB: unknown;
    channel_name: any;
    verified: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyLink: (token: string) => Promise<void>;
}


interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/check-session`);
                setUser(response.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
            setUser(response.data.user);
    }

    const verifyLink = async (token: string) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify`, {params: {token}});
        setUser(response.data.user);
    };

    const logout = async () => {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isLoggedIn: !!user,
            login,
            logout,
            verifyLink
        }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};