import './App.css'

import {Route, Routes} from 'react-router-dom';
import HomePage from "./HomePage.tsx";
import LogIn from "./LogIn.tsx";
import Register from "./Register.tsx";
import Account from "./Account.tsx";
import Channel from "./Channel.tsx";
import UploadVideo from './UploadVideo.tsx';
import VideoPage from "./Components/VideoPage.tsx";

import Navbar from './Navbar/Navbar.tsx';

export default function Router() {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/upload" element={<UploadVideo />} />
                <Route path="/video" element={<VideoPage />} />
            </Routes>
        </>
    );
}