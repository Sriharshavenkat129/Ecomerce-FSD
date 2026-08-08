import {Toaster,toast} from "react-hot-toast"
import {Routes,Route} from "react-router"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ServerIssue from "./pages/serverIssue"
import { useState } from "react"
import Home from "./pages/Home"

export default function App(){
    const [userType,setUserType]=useState("user")
    return(
        <>
        <Toaster position="top-center"></Toaster>
        <Routes>
            <Route path="/" element={<Index/>}></Route>
            <Route path="/login" element={<Login setUserType={setUserType}/>} ></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/ServerError" element={<ServerIssue/>}></Route>
            <Route path="/Home" element={<Home/>}></Route>
        </Routes>
        </>
    )
}