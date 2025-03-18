import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Channel.css';

interface ChannelData {
    channelInfo: {
        username: string;
        profile_picture: string;
        // Add other fields as needed
    },
}

function Channel() {
    const { isLoggedIn, user } = useAuth();
    const { username } = useParams<{ username: string }>();
    const [channelData, setChannelData] = useState<ChannelData | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/channel/${username}`);
                setChannelData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();

        if (isLoggedIn && user && user.username === username) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [isLoggedIn, user, username]);

    if (!channelData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="column">
                    <img
                        src={`${import.meta.env.VITE_API_URL}${channelData.channelInfo.profile_picture}`}
                        alt="Profile Picture" className="profile-picture" />
                    <h1>{channelData.channelInfo.username}</h1>
                </div>
                <div className="column Cthird-column">
                    {isOwner && (
                        <>
                            <Link to="/upload">Upload Video</Link>
                            <Link to="/account">Account</Link>
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