import './App.css'

import {Route, Routes} from 'react-router-dom';
import HomePage from "./pages/home/HomePage.tsx";
import LogIn from "./auth/login/LogIn.tsx";
import Register from "./auth/register/Register.tsx";
import Account from "./pages/account/Account.tsx";
import Channel from "./pages/channel/Channel.tsx";
import UploadVideo from './pages/upload/UploadVideo.tsx';
import VideoPage from "./pages/video/VideoPage.tsx";
import VerifyAccount from './auth/verify/VerifyAccount.tsx';
import {AuthProvider} from './auth/context/AuthContext.tsx';
import ProtectedRoute from './auth/context/ProtectedRoute.tsx';
import Unathorized from "./pages/unathorized/unathorized.tsx";
import History from './pages/history/History.tsx';
import VideoSearch from './pages/videoSearch/VideoSearch.tsx';




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
                <Route path="/video/:id" element={<VideoPage/>}/>
                <Route path="/verify" element={<VerifyAccount/>}/>
                <Route path="/unauthorized" element={<Unathorized/>}/>
                <Route path="/channel/:username" element={<Channel/>}/>
                <Route path="/history" element={<History/>}/>
                <Route path="/videosearch" element={<VideoSearch />} />
                <Route element={<ProtectedRoute/>}>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/upload" element={<UploadVideo/>}/>
                </Route>
            </Routes>
        </>
    );
}