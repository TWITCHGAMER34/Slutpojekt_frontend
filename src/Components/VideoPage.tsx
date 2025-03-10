import React, { useState } from "react";
import styles from "./VideoPage.module.css"

const VideoPage: React.FC = () => {
    // state for dislikes and likes
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    // State for comments
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<string[]>([]);

    // Handlers for like & dislikes
    const handleLike = () => setLikes(likes + 1);
    const handleDislike = () => setDislikes(dislikes + 1);

    // Handle new comment submission
    const handleCommentSubmit = () => {
        if(comment.trim()) {
            setComments([...comments, comment]);
            setComment(""); // Clear input field after
        }
    };

    return (
        <div className={styles.container}>
            <h1>Video Title</h1>
            <video className={styles.video} controls>
                <source src="insert-video-url.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>

            {/* Like & Dislike Buttons */}
            <div className={styles.buttons}>
                <button onClick={handleLike} className={styles.likeButton}>👍 Like ({likes}</button>
                <button onClick={handleDislike} className={styles.dislikeButton}>👎 Dislike ({dislikes})</button>
            </div>

            {/* Comment Section */}
            <div className={styles.commentsSection}>
                <h3>Comments</h3>
                <div className={styles.commentInput}>
                    <input type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className={styles.input}
                    />
                    <button onClick={handleCommentSubmit} className={styles.postButton}>Post</button>
                </div>
                <ul className={styles.commentList}>
                    {comments.map((c, index) => (
                        <li key={index} className={styles.comment}>{c}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VideoPage;