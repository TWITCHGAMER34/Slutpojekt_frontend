import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from "./HomePage.tsx";
import LogIn from "./LogIn.tsx";
import Register from "./Register.tsx";
import RegisterPart2 from "./RegisterPart2.tsx";
import UploadVideo from './UploadVideo.tsx';
import VideoPage from "./Components/VideoPage.tsx";

function App() {
    return (
        <div className="App">
            {/* Define Routes */}
            <VideoPage/>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register2" element={<RegisterPart2 />} />
                <Route path="/upload" element={<UploadVideo />} />
            </Routes>
        </div>
    );
}

export default App;