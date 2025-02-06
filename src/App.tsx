import { useState } from 'react'
import './App.css'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogin = () => {
        setIsLoggedIn(true)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    return (
        <div className="home-page">
            <header>
                <h1>Video Sharing Platform</h1>
                <nav>
                    {isLoggedIn ? (
                        <>
                            <button onClick={handleLogout}>Logout</button>
                            <button>Upload Video</button>
                        </>
                    ) : (
                        <>
                            <a href="/login"><button>Login</button></a>
                            <a href="/register"><button>Register</button></a>
                        </>
                    )}
                </nav>
            </header>
            <main>
                <h2>Featured Videos</h2>
                <div className="video-list">
                    {/* Placeholder for video thumbnails */}
                    <div className="video-item">Video 1</div>
                </div>
            </main>
        </div>
    )
}

export default App