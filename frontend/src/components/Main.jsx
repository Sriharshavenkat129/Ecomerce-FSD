import { MapPinX, ShoppingBag } from "lucide-react"
import app from "../utils/app"
import ProductCard from "./ProductCard"
import RateLimit from "./RateLimit"
import {toast} from "react-hot-toast"
import { useState ,useEffect} from "react"

export default function Main({query,setQuery,products,setProducts}) {
    const [category, setCategory] = useState("")
    const [loading,setLoading]=useState(true)
    const [isRateLimited,setRateLimit]=useState(false)
    useEffect(()=>{
        async function getByCategory(){
        try{
            setLoading(true)
            let response;
            if(category=="")return;
            if(category==" "){
                response=await app.get("/user")
            }
            else{
                response=await app.get(`/user/products/${category}`)
            }
            if(response.data)
            setProducts(response.data.data)
            if(category.length>1)toast.success("products filtered by category")
        }
        catch(error){
            if(error.response.status==404)
                setProducts([])
            if(error.response.status==429)
                setRateLimit(true)
            toast.error(error.response.data.msg?error.response.data.msg:error.response.data)
        }
        finally{
            setLoading(false)
        }
    }
    getByCategory()
    },[category])
    useEffect(()=>{
        const getAllProducts=async ()=>{
            try{
                setLoading(true) 
                const response=await app.get("/user")
                setProducts(response.data.data)
            }
            catch(error){
                if(error.response.status==429)setRateLimit(true)
                toast.error(error.response.data.msg?error.response.data.msg:error.response.data)
            }
            finally{
                setLoading(false)
            }
        }
        getAllProducts()
    },[])
    const productCards=products.map(p=>{
        return <ProductCard
        key={p.product_id}
        product={p}
        />
    })

    const handleFilter=async (e)=>{
        e.preventDefault();
        try{
            setLoading(true)
            let filter={}
            if(query.minPrice)filter.minPrice=query.minPrice
            if(query.maxPrice)filter.maxPrice=query.maxPrice
            if(query.name)filter.product_name=query.name
            const response=await app.get(`/user/products`,
             {params:filter}
            )
            setProducts(response.data.data)
            toast.success(response.data.msg)
        }
        catch(error){
            toast.error(error.response.data.msg)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <main className={`flex flex-col p-2 ${loading?"h-full w-full justify-center items-center":""}`}>
            {isRateLimited==false &&
            <>
            {loading==false &&
            <>
            <section className="flex items-center justify-between] text-md font-semibold sm:px-10 px-1 flex-col w-full lg:flex-row gap-2">
                <form className="flex gap-4 w-full lg:w-1/2" onSubmit={(e)=>handleFilter(e)}>
                    <div className="flex flex-col md:flex-row gap-1">
                        <label className="flex gap-2 text-md border-2 rounded-md p-1 items-center text-nowrap shrink">Min Price :-
                             <input value={query.minPrice} onChange={(e) => { setQuery(pre => ({ ...pre, "minPrice": e.target.value }))}}
                             className="outline-none" type="number" min={100} max={10000000} ></input>
                             </label>
                        <label className="flex gap-2 text-md border-2 rounded-md p-1 items-center text-nowrap shrink">Max Price :- 
                            <input className="outline-none" type="number" min={100} max={10000000}
                            value={query.maxPrice} onChange={(e) => { setQuery(pre => ({ ...pre, "maxPrice": e.target.value }))}}></input>
                            </label>
                    </div>
                    <div className="flex justify-end items-end ml-auto lg:ml-2">
                        <button className="border rounded-md text-md font-semibold bg-orange-500 px-4 py-1 cursor-pointer
                    hover:bg-orange-600 transition-bg duration-300 ease-in-out" type="submit">Apply</button>
                    </div>
                </form>
                <div className="flex flex-row justify-between lg:w-1/2 w-full">
                    <button className={`border-3 rounded-md border-blue-400 px-3 py-2 cursor-pointer
                hover:bg-blue-400 hover:text-white
                transition-all duration-300 ease-in-out
                ${category=="electronics"?"bg-orange-400 border-none text-white":""}`}
                onClick={()=>setCategory(pre=>pre=="electronics"?" ":"electronics")}>
                        Electronics
                    </button>
                    <button className={`border-3 rounded-md border-blue-400 px-3 py-2 cursor-pointer
                hover:bg-blue-400 hover:text-white
                transition-all duration-300 ease-in-out
                ${category=="fashion"?"bg-orange-400 border-none text-white":""}`}
                onClick={()=>setCategory(pre=>pre=="fashion"?" ":"fashion")}>
                        Fashion
                    </button>
                    <button className={`border-3 rounded-md border-blue-400 px-3 py-2 cursor-pointer
                hover:bg-blue-400 hover:text-white
                transition-all duration-300 ease-in-out
                    ${category=="groceries"?"bg-orange-400 border-none text-white":""}`}
                    onClick={()=>setCategory(pre=>pre=="groceries"?" ":"groceries")}>
                        Groceris
                    </button>
                </div>
            </section>
            {products.length!=0?
            <section className="p-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1">
                {productCards}
            </section>
            :
                <div className="h-dvh flex justify-center items-center">
                    <div className=" flex flex-col items-center gap-4">
                        <ShoppingBag size={60}/>
                        <p className="text-xl font-semibold">No products at this moment</p>
                    </div>
                </div>
            }
            </>
            }
            {
                loading &&
                <div className="mb-auto h-svh flex justify-center items-center flex-col gap-4">
                    <div className="size-14 border-8 border-t-8 rounded-full border-gray-100 animate-spin border-t-black"></div>
                    <p className="text-xl font-bold">Loading...</p>
                </div>
            }
            </>
        }
        {
            isRateLimited &&
            <RateLimit/>
        }
        </main>
    )
}