import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

interface VideoData {
    id: string;
    title: string;
    thumbnailUrl: string;
    username: string;
    views: number;
    created_at: string;
}

function HomePage() {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos`);
                console.log(response.data);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="home-page">
            {videos.map((video) => (
                <div className="card" key={video.id}>
                    <img
                        className="thumbnail"
                        src={video.thumbnailUrl}
                        alt={video.title}
                    />
                    <h2 className="title">{video.title}</h2>
                    <h3 className="username">{video.username}</h3>
                    <h3 className="views">{video.views} views</h3>
                    <h3 className="date">{new Date(video.created_at).toLocaleDateString()}</h3>
                    <a href={`http://localhost:5173/video/${video.id}`} className="fillParent"></a>
                </div>
            ))}
        </div>
    );
}

export default HomePage;