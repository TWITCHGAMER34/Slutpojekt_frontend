import './App.css'

import {Route, Routes} from 'react-router-dom';
import HomePage from "./HomePage.tsx";
import LogIn from "./LogIn.tsx";
import Register from "./Register.tsx";
import Account from "./Account.tsx";
import Channel from "./Channel.tsx";
import UploadVideo from './UploadVideo.tsx';
import VideoPage from "./Components/VideoPage.tsx";
import VerifyAccount from './VerifyAccount';
import {AuthProvider} from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Unathorized from "./unathorized/unathorized.tsx";



import Navbar from './Navbar/Navbar.tsx';

export default function App() {
    return (
        <AuthProvider>
            <Router/>
        </AuthProvider>
    );
}

function Router() {

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/video" element={<VideoPage/>}/>
                <Route path="/verify" element={<VerifyAccount/>}/>
                <Route path="/unauthorized" element={<Unathorized/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/channel" element={<Channel/>}/>
                    <Route path="/upload" element={<UploadVideo/>}/>
                </Route>
            </Routes>
        </>
    );
}