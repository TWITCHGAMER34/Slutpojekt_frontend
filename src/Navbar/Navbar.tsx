import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../auth/context/AuthContext.tsx';
import './Navbar.css';
import {FaHome, FaHistory, FaBars, FaSearch, FaTimes, FaUpload, FaUser} from 'react-icons/fa';

function Navbar() {
    const {isLoggedIn, user, logout} = useAuth();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
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
    };

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleHistoryButtonClick = () => {
        navigate('/history');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    }



    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/videosearch?query=${encodeURIComponent(searchQuery)}`);
    };

    const handleUploadButtonClick = () => {
        navigate('/upload');
    }

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="navbar">
            <div className="top-navbar">
                <div className="logo">
                    <a href="/"> <img src="/NinjaHalfpipe logo.png" alt=""/> </a>
                </div>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && <FaTimes className="clear-icon" onClick={clearSearch}/>}
                    <button type="submit" className="search-icon"><FaSearch/></button>
                </form>
                <div className="auth-button">
                    {isLoggedIn && <button onClick={handleUploadButtonClick}>Upload</button>}
                    <button onClick={handleAuthButtonClick}>
                        {isLoggedIn ? 'Account' : 'Log In'}
                    </button>
                    {isLoggedIn && user?.profile_picture && (
                        <Link to={"/channel/" + user?.username}>
                            <img
                                src={`${import.meta.env.VITE_API_URL}${user?.profile_picture}`}
                                alt="Profile Picture"/>
                        </Link>
                    )}
                    {isLoggedIn && <button className="logout-button" onClick={handleLogout}>Log Out</button>}
                </div>
            </div>
            <div className={`side-navbar ${isSideNavOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={handleToggleButtonClick}><FaBars/></button>
                <button className="home-button" onClick={handleHomeButtonClick}><FaHome/><span
                    className="button-text">Home</span></button>
                <button className="history-button" onClick={handleHistoryButtonClick}><FaHistory/><span
                    className="button-text">History</span></button>
                {isLoggedIn && (
                    <button className="upload-button" onClick={handleUploadButtonClick}>
                        <FaUpload/><span className="button-text">Upload</span>
                    </button>
                )}
                <button className="account-button" onClick={handleAuthButtonClick}>
                    <FaUser/><span className="button-text">{isLoggedIn ? 'Account' : 'Log In'}</span>
                </button>
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