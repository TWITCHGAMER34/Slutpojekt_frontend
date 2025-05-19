import {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../../auth/context/AuthContext.tsx';
import './Channel.css';

interface ChannelData {
    channelInfo: {
        username: string;
        profile_picture: string;
        bio: string; // Add bio field
    };
    videos: VideoData[];
}

interface VideoData {
    id: number;
    title: string;
    thumbnail: string;
    views_count: number;
    created_at: string;
}

function Channel() {
    const {isLoggedIn, user} = useAuth();
    const {username} = useParams<{ username: string }>();
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

    const handleDelete = async (videoId: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/video/${videoId}`);
            setChannelData((prevData) => {
                if (prevData) {
                    return {
                        ...prevData,
                        videos: prevData.videos.filter(video => video.id !== videoId),
                    };
                }
                return prevData;
            });
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    if (!channelData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="channel-info">
                    <div className="channel-user">
                        <img
                            src={`${import.meta.env.VITE_API_URL}${channelData.channelInfo.profile_picture}`}
                            alt="Profile Picture" className="profile-picture"/>
                        <h1>{channelData.channelInfo.username}</h1>
                    </div>
                    <div className={"bio"}>
                        <h2>Bio</h2>
                        <p>{channelData.channelInfo.bio}</p>
                    </div>
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
                    {channelData.videos
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by newest first
                        .reverse() // Reverse the order of the sorted array
                        .map(video => (
                            <div key={video.id} className="video-item">
                                <Link to={`/video/${video.id}`}>
                                    <img src={`${import.meta.env.VITE_API_URL}${video.thumbnail}`} alt={video.title}
                                         className="video-thumbnail"/>
                                    <p className="video-title">{video.title}</p>
                                </Link>
                                {isOwner && (
                                    <button onClick={() => handleDelete(video.id)}
                                            className="delete-button">Delete</button>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Channel;