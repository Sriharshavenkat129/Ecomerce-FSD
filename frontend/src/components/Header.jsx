import { Search, ShoppingBasket,  UserCircle2Icon } from "lucide-react";
import app from "../utils/app";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Header({ query, setQuery, setProducts }) {
    const navigate =useNavigate()

    const handleSearch=async ()=>{
        try{
            const response=await app.get("/user/products",{params:{"product_name":query.name}})
            setProducts(response.data.data)
            toast.success(response.data.msg)
        }
        catch(error){
            toast.error(error.response.data.msg || "something went wrong!") 
        }
    }
    return (
        <header className="flex gap-2 items-center py-4 px-2 static left-0 right-0 top-0 justify-between
        shadow-md">
            <div className="font-bold text-3xl font-serif w-1/6">
                <h1>SHV</h1>
            </div>
            <div className="m-auto flex gap-1 border-2 p-1 rounded-xl w-4/6 sm:w-3/6">
                <input type="text" value={query.name} onChange={(e) => { setQuery(pre => ({ ...pre, "name": e.target.value })) }}
                    className="outline-none w-full text-balance font-semibold text-md pl-2"></input>
                <button className="ml-auto mr-1 cursor-pointer" onClick={()=>{handleSearch()}}><Search size={20} /></button>
            </div>
            <div className="flex gap-4 mr-3 w-1/6 sm:w-2/6 justify-end">
                <ShoppingBasket size={35} className="cursor-pointer" onClick={()=>{navigate("/cart")}}/>
                <UserCircle2Icon size={35} className="cursor-pointer" />
            </div>
        </header>
    )
}