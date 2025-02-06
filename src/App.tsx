import './App.css'

import {Route, Routes} from 'react-router-dom';
import HomePage from "./HomePage.tsx";
import LogIn from "./LogIn.tsx";
import Register from "./Register.tsx";
import RegisterPart2 from "./RegisterPart2.tsx";

export default function Router() {

    return (


                <Routes>

                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/register2" element={<RegisterPart2/>}/>




                </Routes>

    );
}