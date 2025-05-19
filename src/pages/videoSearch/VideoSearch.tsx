import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoSearch.css';

interface VideoData {
    id: number;
    title: string;
    thumbnail: string;
    username: string;
    created_at: string;
    views_count: number;
    description: string;
}



function cutDescription(description: string){
    if (description.length > 337){
        return description.slice(0, 337) + "...";
    } else {
        return description
    }
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
            <h2>Search Results:</h2>
            <div className="video-list">
                {videos.map(video => (
                    <div key={video.id} className="search-card">
                        <img
                            className="search-thumbnail"
                            src={`${import.meta.env.VITE_API_URL}` + video.thumbnail}
                            alt={video.title}
                        />
                        <div className={"search-border"}></div>
                        <h2 className="search-title">{video.title}</h2>
                        <div className={"search-info"}>
                            <h3 className="search-views">{video.views_count} views</h3>
                            <h3 className="search-date">{new Date(video.created_at).toLocaleDateString()}</h3>
                            <h3 className="search-username">{video.username}</h3>
                        </div>
                        <p className={"search-description"}>{cutDescription(`${video.description}`)} </p>
                        <a href={`http://localhost:5173/video/${video.id}`} className="fillParent"></a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;