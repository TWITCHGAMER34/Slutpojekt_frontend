import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaHistory, FaUser, FaBars, FaSearch, FaTimes } from 'react-icons/fa';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isSubscriptionsVisible, setIsSubscriptionsVisible] = useState(false);
    const [subscriptions, setSubscriptions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleAuthButtonClick = () => {
        if (isLoggedIn) {
            navigate('/account');
        } else {
            navigate('/login');
        }
    };

    const handleToggleButtonClick = () => {
        setIsSideNavOpen(!isSideNavOpen);
        setIsSubscriptionsVisible(false); // Hide subscriptions when closing the navbar
    };

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleHistoryButtonClick = () => {
        navigate('/history');
    };

    const handleSubscriptionsButtonClick = () => {
        if (isSideNavOpen) {
            if (isLoggedIn) {
                // Fetch and display subscriptions
                setSubscriptions(['Channel 1', 'Channel 2', 'Channel 3']); // Example subscriptions
            } else {
                // Display login prompt
                setSubscriptions([]);
            }
            setIsSubscriptionsVisible(!isSubscriptionsVisible); // Toggle visibility
        }
    };

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/videosearch?query=${searchQuery}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="navbar">
            <div className="top-navbar">
                <div className="logo">
                    <a href="/">Logo</a>
                </div>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && <FaTimes className="clear-icon" onClick={clearSearch} />}
                    <button type="submit" className="search-icon"><FaSearch /></button>
                </form>
                <div className="auth-button">
                    <button onClick={handleAuthButtonClick}>
                        {isLoggedIn ? 'Account' : 'Log In'}
                    </button>
                    <img src="src/assets/ProfilePic.png" alt="Profile Picture" />
                </div>
            </div>
            <div className={`side-navbar ${isSideNavOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={handleToggleButtonClick}><FaBars /></button>
                <button className="home-button" onClick={handleHomeButtonClick}><FaHome /><span className="button-text">Home</span></button>
                <button className="history-button" onClick={handleHistoryButtonClick}><FaHistory /><span className="button-text">History</span></button>
                <button className="subscriptions-button" onClick={handleSubscriptionsButtonClick}><FaUser /><span className="button-text">Subscriptions</span></button>
                <div className="sub-list">
                    {isSubscriptionsVisible && (
                        !isLoggedIn ? (
                            <div className="login-prompt">
                                <p>Logga in om du vill gilla videor, kommentera och prenumerera.</p>
                                <button onClick={() => navigate('/login')}>Logga in</button>
                            </div>
                        ) : (
                            <div className="subscriptions-list">
                                <ul>
                                    {subscriptions.map((sub, index) => (
                                        <li key={index}>{sub}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;