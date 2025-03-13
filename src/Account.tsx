import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Account.css';

function Account() {
    const { isLoggedIn, user } = useAuth();
    const [userInfo, setUserInfo] = useState({
        user: {
            firstname: '',
            lastname: '',
            DOB: '',
            email: '',
            username: '',
            channel_name: '',
            description: '',
            profilePicture: '' as string | File
        }
    });

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUserInfo({ ...userInfo, user: { ...userInfo.user, profilePicture: event.target.files[0] } });
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInfo({ ...userInfo, user: { ...userInfo.user, description: event.target.value } });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('profilePicture', userInfo.user.profilePicture as File);
        formData.append('description', userInfo.user.description);

        try {
            await axios.post('http://localhost:3000/account/update', formData, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            alert('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/account`);
                    setUserInfo({ user: response.data });
                } catch (error) {
                    console.error('Error fetching user info', error);
                }
            };

            fetchUserInfo();
        }
    }, [isLoggedIn]);

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
                    <img src={typeof userInfo.user.profilePicture === 'string' ? userInfo.user.profilePicture : 'src/assets/ProfilePic.png'} alt="Profile Picture" className="profile-picture"/>
                    <h1>{userInfo.user.channel_name || "Channel Name"}</h1>
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
                            value={userInfo.user.description || ''}
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
                        <input type="text" value={userInfo.user.firstname || ''} readOnly/>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input type="text" value={userInfo.user.lastname || ''} readOnly/>
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input type="date" value={userInfo.user.DOB || ''} readOnly/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={userInfo.user.email || ''} readOnly/>
                    </div>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={userInfo.user.username || ''} readOnly/>
                    </div>
                    <div>
                        <label>Channel Name:</label>
                        <input type="text" value={userInfo.user.channel_name || ''} readOnly/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Account;