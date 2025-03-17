import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Channel.css';

interface ChannelData {
    username: string;
    profile_picture: string;
    channel_name: string;
    // Add other fields as needed
}

function Channel() {
    const { isLoggedIn, user } = useAuth();
    const { channel_name } = useParams<{ channel_name: string }>();
    const [channelData, setChannelData] = useState<ChannelData | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/channel/${channel_name}`);
                setChannelData(response.data);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();

        if (isLoggedIn && user && user.channel_name === channel_name) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [isLoggedIn, user, channel_name]);

    if (channel_name === 'test') {
        return (
            <div>
                <h1>This is the test page</h1>
                {/* Add more content for the test page here */}
            </div>
        );
    }

    if (!channelData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="column">
                    <img
                        src={typeof channelData.profile_picture === 'string' ? `${import.meta.env.VITE_API_URL}${user.profile_picture}` : 'src/assets/ProfilePic.png'}
                        alt="Profile Picture" className="profile-picture" />
                    <h1>{channelData.channel_name}</h1>
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