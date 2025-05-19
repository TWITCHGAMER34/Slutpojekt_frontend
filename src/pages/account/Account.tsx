import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import './Account.css';

function Account() {
    const { isLoggedIn, user } = useAuth();
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        DOB: '',
        email: '',
        username: '',
        bio: '',
        profilePicture: '' as string | File
    });
    const [error, setError] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUserData({ ...userData, profilePicture: event.target.files[0] });
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 400) {
            setUserData({ ...userData, bio: value });
            setCharCount(value.length);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData();
        if (userData.profilePicture) {
            formData.append('profile_picture', userData.profilePicture as File);
        }
        if (userData.bio) {
            formData.append('description', userData.bio);
        }

        try {
            if (userData.profilePicture) {
                await axios.post(`${import.meta.env.VITE_API_URL}/account/uploadProfilePicture`, formData, {});
            }
            if (userData.bio) {
                await axios.post(`${import.meta.env.VITE_API_URL}/updateDescription`, { bio: userData.bio });
            }
            alert('Profile picture and/or description updated successfully');
        } catch (error) {
            console.error('Error updating profile picture or description', error);
            setError('Error updating profile picture or description');
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
                    <h1>{user?.username || "Channel Name"}</h1>
                </div>
                <div className="column Cthird-column">
                    <Link to={"/channel/" + user?.username}>Go to Channel</Link>
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
                            value={userData.bio || ''}
                            onChange={handleDescriptionChange}
                            rows={5}
                            maxLength={400}
                            className="description-textarea"
                        />
                        <p className="char-limit">{charCount}/400 characters</p>
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            <div className="account-info" id="bottom">
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
                </form>
            </div>
        </div>
    );
}

export default Account;