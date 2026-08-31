import { IndianRupee } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import RateLimit from "../../components/RateLimit"
import app from "../../utils/app"

export default function ProductCard({ product ,setProducts,setProductManagingId }) {
    if(!product.is_available)return(<></>)
    const [loading,setLoading]=useState(false)
    const [rateLimited,setRateLimited] = useState(false)

    const handleDelete=async ()=>{
        try{
            setLoading(true)
            const response=await app.delete(`admin/products/${product.product_id}`)
            setProducts(prev=>
                prev.map(p=>p.product_id==product.product_id?{...p,"is_available":false}:p)
            )
            toast.success(response.data.msg)
            setProductManagingId(false)
        }
        catch(error){
            if(error.response?.status==429){
                setRateLimited(true)
                return toast.error("too many requests")
            }
            toast.error(error.response?.data.msg || "something went wrong")
        }
        finally{
            setLoading(false)
        }
    }

    if(rateLimited)return <RateLimit/>

    return (
        <div className="flex flex-col bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 w-full">
            
            <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-50">
                <img 
                    src={product.product_image} 
                    alt={product.product_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
            </div>
            
            <div className="flex flex-col grow gap-2 mb-auto">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold font-serif text-gray-900 truncate">
                        {product.product_name}
                    </h3>
                    <p className="flex items-center text-xl font-bold text-gray-900 shrink-0">
                        <IndianRupee size={18} strokeWidth={2.5} className="mr-0.5" />
                        {product.price}
                    </p>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {product.product_description}
                </p>
                <p className={`text-sm font-semibold mt-1 ${product.stock <= 10 && product.stock > 0 ? "text-orange-500" : product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                    {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left in stock`}
                </p>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                { product.is_available &&
                <button className="flex-1 py-2.5 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:bg-red-300"
                disabled={loading}
                onClick={()=>handleDelete(product.product_id)}>
                    Remove product
                </button>
                }
                <button className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-colors cursor-pointer disabled:bg-orange-300"
                onClick={()=>setProductManagingId(product.product_id)}>
                    Manage product
                </button>
            </div>
        </div>
    )
}