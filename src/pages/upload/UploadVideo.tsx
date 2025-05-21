import { useState } from "react";
import axios from "axios";
import * as React from "react";
import styles from "./UploadVideo.module.css";

const UploadVideo: React.FC = () => {
    // State to store the selected video file
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // State to store the video preview URL
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    // State to store the title of the video
    const [title, setTitle] = useState<string>("");

    // State to store the video description
    const [description, setDescription] = useState<string>("");

    // State to store the upload progress percentage
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    // State to store the selected thumbnail image
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // State to store the thumbnail preview URL
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Handle changes to the video file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Update the video file state
            setVideoFile(file);
            // Generate a preview URL for the video file
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Handle changes to the thumbnail image input
    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Update the thumbnail file state
            setThumbnail(file);
            // Generate a preview URL for the thumbnail
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // Handle the video upload process
    const handleUpload = async () => {
        // Validate required fields
        if (!videoFile) return alert("Please select a video file.");
        if (!thumbnail) return alert("Please select an image.");
        if (!title.trim()) return alert("Please enter a title.");
        if (!description.trim()) return alert("Please enter a description.");
        if (!videoFile || isUploading) return;
        setIsUploading(true);
        setSuccess(false);

        // Create a FormData object to send the video and metadata
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        formData.append("description", description);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            // Send the video data to the backend
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploadVideo`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    // Update the upload progress percentage
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });
            setSuccess(true);
            // Optionally reset form here
            // Log the server response
            console.log("Server Response:", response.data);
        } catch (error) {
            // Log any errors
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange}/>
            {/* Display the video preview if available */}
            {videoPreview && <video src={videoPreview} controls width="400"/>}
            <label>Thumbnail:</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange}/>
            {/* Display the thumbnail preview if available */}
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" width="200"/>}
            <input type="text" placeholder="Title" value={title} maxLength={30}
                   onChange={(e) => setTitle(e.target.value)}/>
            <div className={styles.countdown}>{30 - title.length} characters left</div>
            <textarea placeholder="Description" value={description} maxLength={500}
                      onChange={(e) => setDescription(e.target.value)}/>
            <div className={styles.countdown}>{500 - description.length} characters left</div>
            {/* Display the upload progress bar if the upload is in progress */}
            {uploadProgress > 0 && <progress value={uploadProgress} max="100"></progress>}
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
            </button>
            {success && <p style={{ color: "#4caf50", marginTop: "1rem" }}>Upload successful!</p>}
            {/* Button to trigger the upload process */}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadVideo;