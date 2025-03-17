import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Account.css';

function Account() {
    const { isLoggedIn, user } = useAuth();
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        DOB: '',
        email: '',
        username: '',
        channel_name: '',
        description: '',
        profilePicture: '' as string | File
    });

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUserData({ ...userData, profilePicture: event.target.files[0] });
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserData({ ...userData, description: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('profile_picture', userData.profilePicture as File);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/account/uploadProfilePicture`, formData, {});
            alert('Profile picture uploaded successfully');
        } catch (error) {
            console.error('Error uploading profile picture', error);
        }
    };

    if (!isLoggedIn) {
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
                    <img
                        src={typeof user?.profile_picture === 'string' ? `${import.meta.env.VITE_API_URL}${user?.profile_picture}` : 'src/assets/ProfilePic.png'}
                        alt="Profile Picture" className="profile-picture" />
                    <h1>{user?.channel_name || "Channel Name"}</h1>
                </div>
                <div className="column Cthird-column">
                    <button onClick={() => window.location.href = `/channel/${user?.channel_name}`}>View Channel</button>
                </div>
            </div>

            <div className="account-info">
                <h2>Account Information</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label>Profile Picture:</label>
                        <input name={"profile_picture"} type="file" onChange={handleProfilePictureChange} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={user?.description || ''}
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
                        <input type="text" value={user?.firstname || ''} readOnly />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input type="text" value={user?.lastname || ''} readOnly />
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input type="date" value={user?.DOB || ''} readOnly />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={user?.email || ''} readOnly />
                    </div>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={user?.username || ''} readOnly />
                    </div>
                    <div>
                        <label>Channel Name:</label>
                        <input type="text" value={user?.channel_name || ''} readOnly />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Account;