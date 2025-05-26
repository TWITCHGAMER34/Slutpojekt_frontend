/**
 * HomePage component fetches and displays a list of videos from the backend.
 * Each video is shown as a card with a thumbnail, title, username, views, and date.
 * The layout and color scheme are defined in HomePage.css.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

// Define the shape of video data
interface VideoData {
    id: string;
    title: string;
    thumbnail: string;
    username: string;
    views_count: number;
    created_at: string;
}

function HomePage() {
    // State for the list of videos
    const [videos, setVideos] = useState<VideoData[]>([]);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for error messages
    const [error, setError] = useState<string | null>(null);

    // Fetch videos from the backend API on component mount
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos`);
                // Check if the response contains an array of videos
                if (Array.isArray(response.data.videos)) {
                    setVideos(response.data.videos);
                } else {
                    setError("Unexpected response format");
                }
            } catch (error) {
                setError("Error fetching videos");
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Show loading indicator while fetching
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if fetch fails
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="home-page">
            {/* Render a card for each video */}
            {videos.map((video) => (
                <div className="card" key={video.id}>
                    {/* Video thumbnail */}
                    <img
                        className="thumbnail"
                        src={`${import.meta.env.VITE_API_URL}${video.thumbnail}`}
                        alt={video.title}
                    />
                    <div className="border"></div>
                    {/* Video title */}
                    <h2 className="title">{video.title}</h2>
                    {/* Uploader's username */}
                    <h3 className="username">{video.username}</h3>
                    {/* View count */}
                    <h3 className="views">{video.views_count} views</h3>
                    {/* Upload date */}
                    <h3 className="date">{new Date(video.created_at).toLocaleDateString()}</h3>
                    {/* Clickable overlay to navigate to video page */}
                    <a href={`/video/${video.id}`} className="fillParent"></a>
                </div>
            ))}
        </div>
    );
}

export default HomePage;