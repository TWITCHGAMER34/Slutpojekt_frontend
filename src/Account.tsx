import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Account.css';

function Account() {
    const { token, username } = useAuth();
    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname: '',
        DOB: '',
        email: '',
        username: '',
        channel_name: '',
        description: '',
        profilePicture: null
    });

    const handleProfilePictureChange = (event) => {
        setUserInfo({ ...userInfo, profilePicture: event.target.files[0] });
    };

    const handleDescriptionChange = (event) => {
        setUserInfo({ ...userInfo, description: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('profilePicture', userInfo.profilePicture);
        formData.append('description', userInfo.description);

        try {
            await axios.post('http://localhost:3000/account/update', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes', error);
        }
    };

    useEffect(() => {
        if (token) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/account', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserInfo(response.data);
                } catch (error) {
                    console.error('Error fetching user info', error);
                }
            };

            fetchUserInfo();
        }
    }, [token]);

    if (!token) {
        return (
            <div className="login-prompt">
                <p>You need to <a href="/login">log in</a> to view your account.</p>
            </div>
        );
    }

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="column">
                    <img src="src/assets/ProfilePic.png" alt="Profile Picture" className="profile-picture"/>
                    <h1>{userInfo.channel_name || "Channel Name"}</h1>
                </div>
                <div className="column Cthird-column">
                    <button onClick={() => window.location.href = '/channel'}>View Channel</button>
                </div>
            </div>

            <div className="account-info">
                <h2>Account Information</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Profile Picture:</label>
                        <input type="file" onChange={handleProfilePictureChange}/>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={userInfo.description}
                            onChange={handleDescriptionChange}
                            rows={5}
                            maxLength={1000}
                            className="description-textarea"
                        />
                    </div>
                    <p className="char-limit">You can write up to 1000 characters.</p>
                    <button type="submit">Save Changes</button>
                </form>
            </div>

            <div className="account-info">
            <h2>More Account Information</h2>
                <form>
                    <div>
                        <label>First Name:</label>
                        <input type="text" value={userInfo.firstname} readOnly/>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input type="text" value={userInfo.lastname} readOnly/>
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input type="date" value={userInfo.DOB} readOnly/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={userInfo.email} readOnly/>
                    </div>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={userInfo.username} readOnly/>
                    </div>
                    <div>
                        <label>Channel Name:</label>
                        <input type="text" value={userInfo.channel_name} readOnly/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Account;