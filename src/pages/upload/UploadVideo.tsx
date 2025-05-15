import { useState } from "react";
import axios from "axios";
import * as React from "react";
import styles from "./UploadVideo.module.css";

const UploadVideo: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!videoFile) return alert("Please select a video file.");
        if (!thumbnail) return alert("Please select an image.");
        if (!title.trim()) return alert("Please enter a title.");
        if (!description.trim()) return alert("Please enter a description.");

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploadVideo`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });
            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange}/>
            {videoPreview && <video src={videoPreview} controls width="400"/>}
            <label>Thumbnail:</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange}/>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" width="200"/>}
            <input type="text" placeholder="Title" value={title} maxLength={30}
                   onChange={(e) => setTitle(e.target.value)}/>
            <div className={styles.countdown}>{30 - title.length} characters left</div>
            <textarea placeholder="Description" value={description} maxLength={500}
                      onChange={(e) => setDescription(e.target.value)}/>
            <div className={styles.countdown}>{500 - description.length} characters left</div>
            <input type="text" placeholder="Tags (comma separated)" value={tags}
                   onChange={(e) => setTags(e.target.value)}/>
            {uploadProgress > 0 && <progress value={uploadProgress} max="100"></progress>}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadVideo;