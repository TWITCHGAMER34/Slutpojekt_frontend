import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    DOB: number;
    description: string;
    verified: number;
    profile_picture: string;
    token: string;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/check-session`);
                setUser(response.data.user);
                await getUserData()
            } catch (error) {
                console.error('Error in checkSession:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const getUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/account`);
                setUser(response.data.user);
                console.log(user);
                console.log(user?.profile_picture);
            } catch (error) {
                console.error('Error in getUserData:', error);
                setUser(null);
            } finally {
                setLoading(false);
        }};

        checkSession();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        console.log('login response:', response.data);
        setUser(response.data.user);
    };

    const verifyLink = async (token: string) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify`, { params: { token } });
        console.log('verifyLink response:', response.data);
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