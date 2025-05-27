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
        email: user?.email || '',
        username: '',
        bio: '',
        profilePicture: '' as string | File
    });

    const [error, setError] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // Handle changes to the picture input
    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUserData({ ...userData, profilePicture: event.target.files[0] });
        }
    };

    // Handle changes to the bio/description input
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 400) {
            setUserData({ ...userData, bio: value });
            setCharCount(value.length);
        }
    };

    // Handle email change
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, email: event.target.value });
    };

    // Save new email
    const handleEmailSave = async () => {
        setEmailSuccess(null);
        setError(null);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/updateEmail`, { email: userData.email });
            setEmailSuccess('Email updated successfully');
        } catch (err) {
            setError('Error updating email');
        }
    };

    // Handle form submission for updating profile picture and bio/description
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
            setError('Error updating profile picture or description');
        }
    };

    // Password modal handlers
    const openModal = () => {
        setShowModal(true);
        setPasswordFields({ current: '', new: '', confirm: '' });
        setPasswordError(null);
        setPasswordSuccess(null);
    };
    const closeModal = () => setShowModal(false);

    const handlePasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordFields({ ...passwordFields, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (passwordFields.new !== passwordFields.confirm) {
            setPasswordError('New passwords do not match');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/changePassword`, {
                currentPassword: passwordFields.current,
                newPassword: passwordFields.new
            });
            setPasswordSuccess('Password changed successfully');
            setTimeout(closeModal, 1500);
        } catch (err) {
            setPasswordError('Error changing password');
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
                        <input name="profile_picture" type="file" onChange={handleProfilePictureChange} />
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
                        <input
                            type="email"
                            value={userData.email}
                            onChange={handleEmailChange}
                        />
                        <button type="button" onClick={handleEmailSave} style={{ marginLeft: '1rem', marginTop: '10px' }}>Save Email</button>
                        {emailSuccess && <span className="success-message">{emailSuccess}</span>}
                    </div>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={user?.username || ''} readOnly />
                    </div>
                </form>
                <button type="button" onClick={openModal} style={{ marginTop: '1rem' }}>Change Password</button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <div>
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    name="current"
                                    value={passwordFields.current}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="new"
                                    value={passwordFields.new}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirm"
                                    value={passwordFields.confirm}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />
                            </div>
                            {passwordError && <p className="error-message">{passwordError}</p>}
                            {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={closeModal} style={{ marginLeft: '1rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Account;