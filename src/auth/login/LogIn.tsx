import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import './LogIn.css';

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(email, password);
            setMessage('Login successful');
            navigate('/account');
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'An error occurred during login');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button type="submit">Log In</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <a href="/register">Don't have an account?</a>
        </div>
    );
}

export default LogIn;