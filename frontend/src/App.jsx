import {Toaster,toast} from "react-hot-toast"
import {Routes,Route} from "react-router"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Order from "./pages/Order"
import { useState } from "react"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import OrderCart from "./pages/OrderCart"

export default function App(){
    const [userType,setUserType]=useState("user")
    return(
        <>
        <Toaster position="top-center"></Toaster>
        <Routes>
            <Route path="/" element={<Index/>}></Route>
            <Route path="/login" element={<Login setUserType={setUserType}/>} ></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/Home" element={<Home/>}></Route>
            <Route path="/order/:product_id" element={<Order/>}></Route>
            <Route path="/cart" element={<Cart/>}></Route>
            <Route path='/cart/order' element={<OrderCart/>}></Route>
        </Routes>
        </>
    )
}