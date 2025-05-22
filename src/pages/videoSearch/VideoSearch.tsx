/**
 * VideoSearch component fetches and displays videos matching a search query.
 * It shows a list of video cards with thumbnail, title, uploader, views, date, and a short description.
 * The search query is taken from the URL parameters.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoSearch.css';

// Define the shape of video data
interface VideoData {
    id: number;
    title: string;
    thumbnail: string;
    username: string;
    created_at: string;
    views_count: number;
    description: string;
}

// Helper function to truncate long descriptions
function cutDescription(description: string) {
    // Truncate to 257 characters and add "..." if too long
    if (description.length > 257) {
        return description.slice(0, 257) + "...";
    } else {
        return description;
    }
}

const VideoSearch: React.FC = () => {
    // State for the list of videos
    const [videos, setVideos] = useState<VideoData[]>([]);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for error messages
    const [error, setError] = useState<string | null>(null);
    // Get the current location to extract the search query
    const location = useLocation();

    // Fetch videos matching the search query when the component mounts or the query changes
    useEffect(() => {
        const fetchVideos = async () => {
            const query = new URLSearchParams(location.search).get('query');
            if (!query) return;

            try {
                // Request search results from the backend
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/search`, { params: { query } });
                setVideos(response.data.videos);
            } catch (error) {
                setError('Error fetching search results');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [location.search]);

    // Show loading indicator while fetching
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if fetch fails
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="video-search-container">
            <h2 id="search-result">Search Results:</h2>
            <div className="video-list">
                {/* Render a card for each video */}
                {videos.map(video => (
                    <div key={video.id} className="search-card">
                        {/* Video thumbnail */}
                        <img
                            className="search-thumbnail"
                            src={`${import.meta.env.VITE_API_URL}${video.thumbnail}`}
                            alt={video.title}
                        />
                        <div className="search-border"></div>
                        {/* Video title */}
                        <h2 className="search-title">{video.title}</h2>
                        <div className="search-info">
                            {/* View count */}
                            <h3 className="search-views">{video.views_count} views</h3>
                            {/* Upload date */}
                            <h3 className="search-date">{new Date(video.created_at).toLocaleDateString()}</h3>
                            {/* Uploader's username */}
                            <h3 className="search-username">{video.username}</h3>
                        </div>
                        {/* Truncated description */}
                        <p className="search-description">{cutDescription(video.description)}</p>
                        {/* Clickable overlay to navigate to video page */}
                        <a href={`/video/${video.id}`} className="fillParent"></a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;