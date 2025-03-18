import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./VideoPage.module.css";

interface VideoData {
    video: {
        title: string;
        description: string;
        url: string;
        likes_count: number;
        dislikes_count: number;
        views_count: number;
        created_at: string;
        user_id: string;
    };
}

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/getVideo/${id}`);
                setVideoData(response.data);
                console.log("Video data:", response.data);
                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/getUser/${response.data.video.user_id}`);
                setUsername(userResponse.data.user.username);
            } catch (error) {
                setError("Error fetching video data");
                console.error("Error fetching video data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [id]);

    const handleLike = async () => {
        if (!videoData) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/likeVideo/${id}`);
            setVideoData({
                ...videoData,
                video: {
                    ...videoData.video,
                    likes_count: videoData.video.likes_count + 1,
                },
            });
        } catch (error) {
            console.error("Error liking video:", error);
        }
    };

    const handleDislike = async () => {
        if (!videoData) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/dislikeVideo/${id}`);
            setVideoData({
                ...videoData,
                video: {
                    ...videoData.video,
                    dislikes_count: videoData.video.dislikes_count + 1,
                },
            });
        } catch (error) {
            console.error("Error disliking video:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!videoData) {
        return <div>No video data found</div>;
    }

    console.log("Video URL:", videoData.video.url);

    return (
        <div className={styles.fullPage}>
            <div className={styles.container}>
                <video className={styles.video} controls>
                    <source src={`${import.meta.env.VITE_API_URL}${videoData.video.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className={styles.title}>
                    <h1>{videoData.video.title}</h1>
                </div>

                <div className={styles.meta}>
                    <p>Uploaded by: {username || "Unknown"}</p>
                    <p>Published: {new Date(videoData.video.created_at).toLocaleDateString()}</p>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.likeButton} onClick={handleLike}>👍 Like ({videoData.video.likes_count})</button>
                    <button className={styles.dislikeButton} onClick={handleDislike}>👎 Dislike ({videoData.video.dislikes_count})</button>
                </div>

                <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{videoData.video.description}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;