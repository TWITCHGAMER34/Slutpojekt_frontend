import {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../../auth/context/AuthContext.tsx';
import './Channel.css';

// Define the structure of the channel data
interface ChannelData {
    channelInfo: {
        username: string;
        profile_picture: string;
        bio: string;
    };
    // List of videos associated with the channel
    videos: VideoData[];
}

// Define the structure of each video data
interface VideoData {
    id: number;
    title: string;
    thumbnail: string;
    views_count: number;
    created_at: string;
}

function Channel() {
    // Access authentication state and user information from AuthContext
    const {isLoggedIn, user} = useAuth();

    // Get the username from the URL parameters
    const {username} = useParams<{ username: string }>();

    // State to store channel data fetched from the backend
    const [channelData, setChannelData] = useState<ChannelData | null>(null);

    // State to determine if the logged-in user is the owner of the channel
    const [isOwner, setIsOwner] = useState(false);

    // Fetch channel data and determine ownership on component mount or when dependencies change
    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // Fetch channel data from the backend
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/channel/${username}`);
                setChannelData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();

        // Check if the logged-in user is the owner of the channel
        if (isLoggedIn && user && user.username === username) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [isLoggedIn, user, username]);

    // Handle the deletion of a video
    const handleDelete = async (videoId: number) => {
        try {
            // Send a delete request to the backend
            await axios.delete(`${import.meta.env.VITE_API_URL}/video/${videoId}`);
            // Update the state to remove the deleted video
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

    // Display a loading message while channel data is being fetched
    if (!channelData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="account-wrapper">
            <div className="account-container">
                <div className="column"></div>
                <div className="channel-info">
                    <div className="channel-user">
                        /* Display the channel owner's profile picture and username */
                        <img
                            src={`${import.meta.env.VITE_API_URL}${channelData.channelInfo.profile_picture}`}
                            alt="Profile Picture" className="profile-picture"/>
                        <h1>{channelData.channelInfo.username}</h1>
                    </div>
                    <div className={"bio"}>
                        /* Display the channel owner's bio */
                        <h2>Bio</h2>
                        <p>{channelData.channelInfo.bio}</p>
                    </div>
                </div>
                <div className="column Cthird-column">
                    /* Display links for the channel owner */
                    {isOwner && (
                            <>
                                <Link to="/upload">Upload Video</Link>
                                <Link to="/account">Account</Link>
                            </>
                        )}
                </div>
            </div>

            /* Section to display the channel's videos */
            <div className="user-videos">
                <h1>Videos</h1>
                <div className="videos">
                    {channelData.videos
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by newest first
                        .reverse() // Reverse the order of the sorted array
                        .map(video => (
                            <div key={video.id} className="video-item">
                                /* Link to the video page */
                                <Link to={`/video/${video.id}`}>
                                    <img src={`${import.meta.env.VITE_API_URL}${video.thumbnail}`} alt={video.title}
                                         className="video-thumbnail"/>
                                    <p className="video-title">{video.title}</p>
                                </Link>
                                /* Display delete button for the channel owner */
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