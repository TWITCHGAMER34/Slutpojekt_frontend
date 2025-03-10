import './App.css'

import {Route, Routes} from 'react-router-dom';
import HomePage from "./HomePage.tsx";
import LogIn from "./LogIn.tsx";
import Register from "./Register.tsx";

export default function Router() {

    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>

    );
}