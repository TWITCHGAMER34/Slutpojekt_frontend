import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../auth/context/AuthContext.tsx';
import './Navbar.css';
import {FaHome, FaHistory, FaBars, FaSearch, FaTimes, FaUpload, FaUser} from 'react-icons/fa';

function Navbar() {
    // Access authentication state and functions from AuthContext
    const {isLoggedIn, user, logout} = useAuth();

    // State to manage the visibility of the side navigation menu
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    // State to manage the search query input
    const [searchQuery, setSearchQuery] = useState('');

    // Navigate to different routes
    const navigate = useNavigate();

    // Handle the click event for the authentication button
    // Redirects to the account page if logged in, otherwise to the login page
    const handleAuthButtonClick = () => {
        if (isLoggedIn) {
            navigate('/account');
        } else {
            navigate('/login');
        }
    };

    // Toggle the visibility of the side navigation menu
    const handleToggleButtonClick = () => {
        setIsSideNavOpen(!isSideNavOpen);
    };

    // Navigate to the home page
    const handleHomeButtonClick = () => {
        navigate('/');
    };

    // Navigate to the history page
    const handleHistoryButtonClick = () => {
        navigate('/history');
    };

    // Handle user logout and redirect to the home page
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    // Handle the search form submission
    // Redirects to the video search results page with the query as a parameter
    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/videosearch?query=${encodeURIComponent(searchQuery)}`);
    };

    // Navigate the upload page
    const handleUploadButtonClick = () => {
        navigate('/upload');
    }

    // Clear the search query input
    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="navbar">
            <div className="top-navbar">
                <div className="logo">
                    <a href="/"> <img src="/NinjaHalfpipe logo.png" alt=""/> </a>
                </div>
                /* Search bar for video search */
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    /* Clear search query button */
                    {searchQuery && <FaTimes className="clear-icon" onClick={clearSearch}/>}
                    <button type="submit" className="search-icon"><FaSearch/></button>
                </form>
                <div className="auth-button">
                    /* Upload button visible only when logged in */
                    {isLoggedIn && <button onClick={handleUploadButtonClick}>Upload</button>}
                    /* Authentication button for login or account */
                    <button onClick={handleAuthButtonClick}>
                        {isLoggedIn ? 'Account' : 'Log In'}
                    </button>
                    /* Profile picture linking to the user's channel */
                    {isLoggedIn && user?.profile_picture && (
                        <Link to={"/channel/" + user?.username}>
                            <img
                                src={`${import.meta.env.VITE_API_URL}${user?.profile_picture}`}
                                alt="Profile Picture"/>
                        </Link>
                    )}
                    /* Logout button visible only when logged in */
                    {isLoggedIn && <button className="logout-button" onClick={handleLogout}>Log Out</button>}
                </div>
            </div>
            /* Side navigation menu */
            <div className={`side-navbar ${isSideNavOpen ? 'open' : ''}`}>
                /* Toggle button to open/close the side navigation */
                <button className="toggle-button" onClick={handleToggleButtonClick}><FaBars/></button>
                /* Navigation links */
                <button className="home-button" onClick={handleHomeButtonClick}><FaHome/><span
                    className="button-text">Home</span></button>
                <button className="history-button" onClick={handleHistoryButtonClick}><FaHistory/><span
                    className="button-text">History</span></button>
                /* Upload button only visible when logged in */
                {isLoggedIn && (
                    <button className="upload-button" onClick={handleUploadButtonClick}>
                        <FaUpload/><span className="button-text">Upload</span>
                    </button>
                )}
                /* Account or login button */
                <button className="account-button" onClick={handleAuthButtonClick}>
                    <FaUser/><span className="button-text">{isLoggedIn ? 'Account' : 'Log In'}</span>
                </button>
                /* Logout button only visible when logged in */
                {isLoggedIn && (
                    <button className="logout-button" onClick={handleLogout}>
                        <FaTimes/><span className="button-text">Log Out</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Navbar;