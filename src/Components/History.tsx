import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './History.module.css';

interface HistoryItem {
    id: number;
    title: string;
    thumbnail: string;
}

const History: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className={styles.historyContainer}>
            <h2 className={styles.title}>Recently Viewed Videos</h2>
            <div className={styles.historyList}>
                {historyItems.map(item => (
                    <Link to={`/video/${item.id}`} key={item.id} className={styles.historyItem}>
                        <img src={`${import.meta.env.VITE_API_URL}${item.thumbnail}`} alt={item.title} className={styles.thumbnail} />
                        <p className={styles.videoTitle}>{item.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default History;