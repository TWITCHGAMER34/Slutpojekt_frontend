import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import './LogIn.css';

function LogIn() {
    // State variables to manage form data and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Access the login function from the AuthContext
    const { login } = useAuth();

    // Navigate to different routes
    const navigate = useNavigate();

    // Handle form submission for login
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Attempt to log in with the provided email and password
            await login(email, password);
            setMessage('Login successful');
            navigate('/account');
        } catch (error: any) {
            // Display error message if login fails
            setMessage(error.response?.data?.error || 'An error occurred during login');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <h1>Log In</h1>

                /* Form for user to input email and password */
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
                /* Display message based on login status */
                {message && <p>{message}</p>}
            </div>
            <a href="/register">Don't have an account?</a>
        </div>
    );
}

export default LogIn;