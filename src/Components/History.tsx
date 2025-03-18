import React from 'react';
import styles from './History.module.css';

const History: React.FC = () => {
    const historyItems = [
        { id: 1, title: 'Video 1', thumbnail: 'path/to/thumbnail1.jpg'},
        { id: 2, title: 'Video 2', thumbnail: 'path/to/thumbnail2.jpg'},
        { id: 3, title: 'Video 3', thumbnail: 'path/to/thumbnail3.jpg'},
    ];

    return (
        <div className={styles.historyContainer}>
            <h2 className={styles.title}>Recently Viewed Videos</h2>
            <div className={styles.historyList}>
                {historyItems.map(item => (
                    <div key={item.id} className={styles.historyItem}>
                        <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                        <p className={styles.videoTitle}>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;