import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './History.module.css';

interface HistoryItem {
    id: number;
    title: string;
    thumbnail: string;
    username: string;
    views_count: number;
    created_at: string;
}

const History: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 4;


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`);
                setHistoryItems(response.data.history);
                console.log("History data:", response.data);
            } catch (error) {
                setError("Error fetching history data");
                console.error("Error fetching history data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const visibleItems = historyItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const canGoNext = startIndex + ITEMS_PER_PAGE < historyItems.length;
    const canGoPrevious = currentPage > 0;

    const handleNext = () => {
        if (canGoNext) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (canGoPrevious) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className={styles.historyContainer}>
            <h2 className={styles.top__text}>Recently Viewed Videos</h2>
            <div className={styles.historyList}>
                {visibleItems.map(item => (
                    <Link to={`/video/${item.id}`} key={item.id} className={styles.historyItem}>
                        {/* Video thumbnail */}
                        <img
                            className={styles.thumbnail}
                            src={`${import.meta.env.VITE_API_URL}${item.thumbnail}`}
                            alt={item.title}
                        />
                        <div className={styles.border}></div>
                        {/* Video title */}
                        <h2 className={styles.title}>{item.title}</h2>
                        {/* Uploader's username */}
                        <h3 className={styles.username}>{item.username}</h3>
                        {/* View count */}
                        <h3 className={styles.views}>{item.views_count} views</h3>
                        {/* Upload date */}
                        <h3 className={styles.date}>{new Date(item.created_at).toLocaleDateString()}</h3>
                        {/* Clickable overlay to navigate to video page */}
                    </Link>
                ))}
            </div>
            <div className={styles.buttonContainer}>
                {canGoPrevious && (
                    <button className={styles.navButton} onClick={handlePrevious}>Previous</button>
                )}
                {canGoNext && (
                    <button className={styles.navButton} onClick={handleNext}>Next</button>
                )}
            </div>
        </div>
    );
};

export default History;