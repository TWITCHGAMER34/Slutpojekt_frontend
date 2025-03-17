import React, { useState, useEffect } from "react";
//import axios from "axios";
import styles from "./VideoPage.module.css"

const VideoPage: React.FC = () => {
    // state for dislikes and likes
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    // State for comments
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<string[]>([]);
    const [expandedComments, setExpandedComments] = useState<{ [index: number]: boolean }>({}); // Track expanded comments by index
    const maxCommentLength = 300; // Maximum length for truncated comment
    // Handle new comment submission


    // Handle toggling expanded state for a specific comment
    const toggleCommentExpansion = (index: number) => {
        setExpandedComments({
            ...expandedComments,
            [index]: !expandedComments[index], // Toggle the expansion state for the given comment
        });
    };



    // State for showing more description and obtaining it
    const [description, setDescription] = useState<string>("");
    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(true);

    // Dynamically shorten the long description
    const truncateText = (text: string, maxLength: number): string => {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    useEffect(() => {
        setLoading(true); // Ensure we simulate loading state

        // Simulate a backend response after 1 second
        const mockDescription = async () => {
            return new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve(
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque neque ac nisi fermentum maximus Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque neque ac nisi fermentum maximus Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque neque ac nisi fermentum maximus."
                    );
                }, 1); // Simulate API delay
            });
        };

        (async () => {
            try {
                const description = await mockDescription();
                setDescription(description); // Store the long description
            } catch (error) {
                console.error("Error fetching description:", error);
                setDescription("Faild to load description");
            } finally {
                setLoading(false); // Stop loading spinner
            }
        })();
    }, []);

    // Length for the short version of the description
    const maxShortLength = 200;





    // Handlers for like & dislikes
    const handleLike = () => setLikes(likes + 1);
    const handleDislike = () => setDislikes(dislikes + 1);

    // Handle new comment submission
    const handleCommentSubmit = (event: React.FormEvent
    ) => {
        event.preventDefault();
        if(comment.trim()) {
            setComments([...comments, comment]);
            setComment(""); // Clear input field after
        }
    };

    return (
        <div className={styles.fullPage}>
        <div className={styles.container}>

            <video className={styles.video} controls>
                <source src="insert-video-url.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>

            <div className={styles.title}>
                <h1>Much longer video title so that i can see what a normal title might look like especially at such a length as this.
                    Adding some extra text because as it turns out the last one was not long enough, whoops.</h1>
            </div>

            {/* Like & Dislike Buttons */}
            <div className={styles.buttons}>
                <button onClick={handleLike} className={styles.likeButton}>👍 Like ({likes})</button>
                <button onClick={handleDislike} className={styles.dislikeButton}>👎 Dislike ({dislikes})</button>
            </div>

            {/* Description */}

            <div className={styles.description}>
                <h3>Description</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                // Dynamically toggle between short and full description
                <p>{showMore ? description : truncateText(description, maxShortLength)}</p>
            )}
            {!loading && (


                <button
                    onClick={() => setShowMore(!showMore)}
                    className={styles.SMButton}
                >
                    {showMore ? "Show Less" : "Show More"}
                </button>

            )}
            </div>

            {/* Add New Comment Section */}
            <form onSubmit={handleCommentSubmit} className={styles.commentButton}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className={styles.commentInput}
                />
                <button type="submit" className={styles.submitCommentButton}>
                    Comment
                </button>
            </form>

            {/* Comments List Section */}
            <div className={styles.commentSection}>
                <h3>Comments</h3>
                {comments.map((text, index) => (
                    <div key={index} className={styles.commentItem}>
                        <p> {expandedComments[index]
                            ? text  // Show full text if expanded
                            : text.length > maxCommentLength
                                ? `${text.substring(0, maxCommentLength)}...`
                                : text}
                        </p>
                        <button onClick={() => toggleCommentExpansion(index)}
                        >
                            {expandedComments[index] ? "Show Less" : "Show More"}

                        </button>

                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};






export default VideoPage;