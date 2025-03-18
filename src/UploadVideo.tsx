import { useState } from "react";
import axios from "axios";
import * as React from "react";
import styles from "./Components/UploadVideo.module.css";
import {useAuth} from "./AuthContext.tsx";

const UploadVideo: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setVideoFile(file);
    };

    const handleUpload = async () => {
        if (!videoFile) return alert("Please select a video file.");

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);

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

            alert("Upload successful!");
            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            {uploadProgress > 0 && <progress value={uploadProgress} max="100"></progress>}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadVideo;