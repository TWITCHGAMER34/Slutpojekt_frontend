import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
    user: {
        username: string;
        profile_picture: string;
    };
    comments: {
        id: string;
        user_id: string;
        comment: string;
        created_at: string;
        username: string;
    }[];
}
interface recommendedVideoData {
    id: string;
    title: string;
    thumbnail: string;
    username: string;
    views_count: number;
    created_at: string;
}

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [videos, setVideos] = useState<recommendedVideoData[]>([]);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/getVideo/${id}`);
                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/getUser/${response.data.video.user_id}`);
                const commentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/getComments/${id}`);
                setVideoData({
                    video: response.data.video,
                    user: userResponse.data.user,
                    comments: commentsResponse.data.comments,
                });
            } catch (error) {
                setError("Error fetching video data");
                console.error("Error fetching video data:", error);
            } finally {
                setLoading(false);
            }
        };

        const addToHistoryAndIncrementViews = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/history/${id}`);
                await axios.post(`${import.meta.env.VITE_API_URL}/incrementViews/${id}`);
                setVideoData((prevData) => {
                    if (prevData) {
                        return {
                            ...prevData,
                            video: {
                                ...prevData.video,
                                views_count: prevData.video.views_count + 1,
                            },
                        };
                    }
                    return prevData;
                });
            } catch (error) {
                console.error('Error adding video to history or incrementing views:', error);
            }
        };

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

        fetchVideos()
        fetchVideoData();
        addToHistoryAndIncrementViews();
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

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/commentVideo/${id}`, { comment });
            setVideoData((prevData) => {
                if (prevData) {
                    return {
                        ...prevData,
                        comments: [
                            ...prevData.comments,
                            {
                                id: new Date().toISOString(),
                                user_id: "currentUserId", // Replace with actual user ID
                                comment,
                                created_at: new Date().toISOString(),
                                username: "currentUsername", // Replace with actual username
                            },
                        ],
                    };
                }
                return prevData;
            });
            setComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
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

    const description = showFullDescription ? videoData.video.description : videoData.video.description.slice(0, 310);





        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

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
                    <img src={`${import.meta.env.VITE_API_URL}${videoData.user.profile_picture}`} alt="Profile" className={styles.profilePicture} />
                    <p>
                        Uploaded by: <Link to={`/channel/${videoData.user.username}`}> {videoData.user.username}</Link>
                        <br />
                        Published: {new Date(videoData.video.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.likeButton} onClick={handleLike}>👍 Like ({videoData.video.likes_count})</button>
                    <button className={styles.dislikeButton} onClick={handleDislike}>👎 Dislike ({videoData.video.dislikes_count})</button>
                </div>

                <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{description}{!showFullDescription && videoData.video.description.length > 310 && "..."}</p>
                    {videoData.video.description.length > 310 && (
                        <button onClick={toggleDescription} className={styles.readMoreButton}>
                            {showFullDescription ? "Read Less" : "Read More"}
                        </button>
                    )}
                </div>

                <div className={styles.commentsSection}>
                    <h3>Comments</h3>
                    <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment"
                            required
                        />
                        <button type="submit">Post Comment</button>
                    </form>
                    <div className={styles.commentsList}>
                        {videoData.comments.map((comment) => (
                            <div key={comment.id} className={styles.comment}>
                                <div className={styles.commentInfo}>
                                <p className={styles.commentUser}><strong>{comment.username}</strong></p>
                                <p className={styles.commentData}>{new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p>{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.recommendations}>
                {videos.map((video) => (

                    <div className="card" key={video.id}>
                        <img
                            className="thumbnail"
                            src={`${import.meta.env.VITE_API_URL}` + video.thumbnail}
                            alt={video.title}
                        />
                        <div className={"border"}></div>
                        <h2 className="title">{video.title}</h2>
                        <h3 className="username">{video.username}</h3>
                        <h3 className="views">{video.views_count} views</h3>
                        <h3 className="date">{new Date(video.created_at).toLocaleDateString()}</h3>
                        <a href={`http://localhost:5173/video/${video.id}`} className="fillParent"></a>
                    </div>

                ))}
            </div>
        </div>
    );
};





export default VideoPage;