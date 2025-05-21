import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './Register.css';


// This component handles user registration
interface FormData {
    firstname: string;
    lastname: string;
    DOB: string;
    email: string;
    password: string;
    confirm_password: string;
    username: string;
}

const RegistrationForm: React.FC = () => {
    // State to manage form input values
    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        DOB: '',
        email: '',
        password: '',
        confirm_password: '',
        username: '',
    });
    // State to manage error messages
    const [error, setError] = useState<string | null>(null);

    // Handle changes to input fields and updates state
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send form data to the backend for registration
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, formData); // Replace with your backend URL
            setError(response.data.message); // Display success message
        } catch (error: any) {
            // Handle errors and display appropriate messages
            setError(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="register-container">
            <div className="register-page">
                <h1>Register</h1>

                {/* Form for user to register with user details */}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required/>
                    <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required/>
                    <input type="date" name="DOB" onChange={handleChange} required/>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                    <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} required/>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                    <div> <button type="submit">Register</button> </div>
                    {error && <p>{error}</p>}
                </form>
            </div>
            <a href="/LogIn">Already have an account?</a>
        </div>
    );
};

export default RegistrationForm;