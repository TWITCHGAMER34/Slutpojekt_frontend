import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoSearch.css';

interface VideoData {
    id: number;
    title: string;
    thumbnail: string;
}

const VideoSearch: React.FC = () => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchVideos = async () => {
            const query = new URLSearchParams(location.search).get('query');
            if (!query) return;

            try {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="video-search-container">
            <h2>Search Results</h2>
            <div className="video-list">
                {videos.map(video => (
                    <div key={video.id} className="video-item">
                        <img src={`${import.meta.env.VITE_API_URL}${video.thumbnail}`} alt={video.title} className="video-thumbnail" />
                        <p className="video-title">{video.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;