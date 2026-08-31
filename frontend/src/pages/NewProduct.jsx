import { image } from "framer-motion/client"
import { ArrowLeftCircle, ImageUpIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import app from "../utils/app"
import { useNavigate } from "react-router"

export default function NewProduct() {
    const [newProduct, setNewProduct] = useState({
        "product_name": "",
        "product_image": "",
        "product_description": "",
        "stock": "",
        "price": "",
        "category": "",
        "is_avaiable": true
    })

    const [imageUrl, setImangeUrl] = useState()
    const [loading,setLoading] = useState(false)
    const navigate=useNavigate()

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewProduct(pre => ({ ...pre, "product_image": file }))
            setImangeUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit=async (e)=>{
        e.preventDefault()
        const formData = new FormData()
        for(let field of ["product_name","product_image","product_description","stock","price","category"]){
            if(!newProduct[field])
                return toast.error("enter all fields")
            formData.append(field,newProduct[field])
        }
        try{
            setLoading(true)
            const response = await app.post("/admin/products",formData)
            toast.success(response.data.msg || "product created successfully🎉")
        }
        catch(error){
            if(error.response?.status==429)
                return toast.error("too many requests")
            toast.error(error.response?.data.msg  ||  "something went wrong!")
        }
        finally{
            setLoading(false)
        }
        navigate(-1)
    }

    if(loading){
        return(
            <div className="flex justify-center items-center p-4 h-screen">
                <div className="animate-spin border-6 size-10 rounded-full border-t-blue-400 border-gray-200">

                </div>
            </div>
        )
    }


    return (
        <div className="h-screen p-4 flex flex-col items-center justify-center">
            <div className=" p-4 border border-gray-100 rounded-xl shadow-md min-w-[400px] max-w-auto">
                <div className="flex gap-2 items-center text-sm font-semibold">
                    <ArrowLeftCircle size={30} className="cursor-pointer mb-2 hover:scale-102 transition-all duration-300 ease-in-out mt-2"
                onClick={()=>{navigate(-1)}}/>
                Back to Dashboard</div>
                <p className="text-xl mb-4 font-semibold text-black">New Product:</p>
                <form className="flex flex-col gap-2 w-full max-w-md sm:w-md" onSubmit={(e)=>handleSubmit(e)}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input required type="text" name="product_name" value={newProduct.product_name}
                            onChange={(e) => { setNewProduct(pre => ({ ...pre, "product_name": e.target.value })) }}
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Wireless Headphones" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                        <div className="w-full h-40 overflow-hidden border-2 border-gray-300 border-dashed flex justify-center items-center rounded-2xl cursor-pointer">
                            {imageUrl ?
                                <>
                                    <img src={imageUrl} alt="product_demo_image" className="h-full w-full object-cover" />
                                </>
                                : <>
                                    <label className="flex flex-col  justify-center items-center gap-1 cursor-pointer"
                                        htmlFor="image">
                                        <ImageUpIcon size={30} />
                                        <p className="text-sm font-semibold text-gray-700">upload product Image</p>
                                        <p className="text-sm font-semibold text-gray-700">jpeg/jpg/png max:5mb</p>
                                    </label>
                                    <input type="file" id="image" accept="image/*" name="product_image" onChange={(e) => { handleImageUpload(e) }} className="hidden" />
                                </>
                                }
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-1 text-sm font-semibold text-gray-700">
                            Category:
                        </label>
                        <select name="category" id="category" value={newProduct.category} onChange={(e)=>setNewProduct(pre=>({...pre,"category":e.target.value}))}
                        className="font-semibold text-sm text-gray-700 outline-none p-2 border rounded-lg cursor-pointer border-gray-300 w-full
                        focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <option value="" disabled>- - - Category - - -</option>
                            <option value="fashion">Fashion</option>
                            <option value="electronics">Electronics</option>
                            <option value="groceries">Groceries</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-1 block">Price (₹)</label>
                        <input type="number" min="0" id="price" value={newProduct.price} name="price" onChange={(e)=>{setNewProduct(pre=>({...pre,"price":e.target.value}))}}
                        className="p-2 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                    </div>
                    
                    <div>
                        <label htmlFor="stock" className="text-sm font-semibold text-gray-700 mb-1 block">Initial Stock</label>
                        <input type="number" min="0" id="stock" value={newProduct.stock} name="stock" onChange={(e)=>{setNewProduct(pre=>({...pre,"stock":e.target.value}))}}
                        className="p-2 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1 block">Description *(min length required-6)</label>
                        <textarea  id="description" name="product_description" value={newProduct.product_description} onChange={(e)=>{setNewProduct(pre=>({...pre,"product_description":e.target.value}))}}
                                    placeholder="e.g, This is amazing product.." required minLength={6} maxLength={200}
                        className="p-2 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"/>
                    </div>
                    <button className="bg-orange-400 text-white text-md font-semibold px-4 py-1 rounded-lg 
                    hover:bg-orange-500 active:bg-orange-400 active:scale-98 transition-all duration-300
                    ease-in-out cursor-pointer hover:rounded-xl">+ Add Product</button>
                </form>
            </div>
        </div>
    )
}