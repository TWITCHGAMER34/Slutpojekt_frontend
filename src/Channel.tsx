import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Channel.css';

function Channel() {
    const { token, username } = useAuth();
    const [channelInfo, setChannelInfo] = useState({
        username: '',
        profilePictureUrl: 'src/assets/ProfilePic.png',
        channelName: ''
    });

    useEffect(() => {
        const fetchChannelInfo = async () => {
            try {
                const response = await axios.get('http://localhost:3000/channel', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChannelInfo(response.data);
            } catch (error) {
                console.error('Error fetching channel info', error);
            }
        };

        fetchChannelInfo();
    }, [token]);

    const isOwner = token && username === channelInfo.username;

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="column">
                    <img src={channelInfo.profilePictureUrl} alt="Profile Picture" className="profile-picture"/>
                    <h1>{channelInfo.username}</h1>
                </div>
                <div className="column Cthird-column">
                    {isOwner && (
                        <>
                            <button onClick={() => window.location.href = '/account'}>View Account</button>
                            <button onClick={() => window.location.href = '/upload'}>Upload Video</button>
                        </>
                    )}
                </div>
            </div>
            <div className="user-videos">
                <h1>Videos</h1>
                <div className="videos">
                    {/* Design for the videos */}
                </div>
            </div>
        </div>
    );
}

export default Channel;