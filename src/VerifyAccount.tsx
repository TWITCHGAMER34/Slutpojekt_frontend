import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyAccount: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const location = useLocation();

    useEffect(() => {
        const verifyUser = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify`, { params: { token } });
                    setMessage(response.data.message);
                } catch (error: any) {
                    setMessage(error.response?.data?.error || 'An error occurred');
                }
            } else {
                setMessage('Invalid verification link');
            }
        };

        verifyUser();
    }, [location]);

    return (
        <div className="verify-container">
            <h1>Account Verification</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerifyAccount;