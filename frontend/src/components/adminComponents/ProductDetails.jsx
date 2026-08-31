import { useEffect, useState } from "react"
import app from "../../utils/app"
import toast from 'react-hot-toast'
import RateLimit from "../../components/RateLimit" 
import { ArrowLeftCircle, ImageUpIcon } from "lucide-react" 

export default function ProductDetails({ setProducts, productManagingId, setProductManagingId }) {
    const [loading, setLoading] = useState(true)
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    const [product, setProduct] = useState({
        product_name: "",
        product_description: "",
        stock: "",
        price: "",
        category: "",
    })

    const [imagePreview, setImagePreview] = useState("")
    const [newImageFile, setNewImageFile] = useState(null)

    useEffect(() => {
        async function getProduct() {
            try {
                setLoading(true)
                const response = await app.get(`/admin/products/${productManagingId}`)
                setProduct(response.data.data)
                setImagePreview(response.data.data.product_image)
            } catch (error) {
                if (error.response?.status === 429) {
                    setIsRateLimited(true)
                    return toast.error("Too many requests")
                }
                toast.error(error.response?.data?.msg || "Something went wrong!")
            } finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [productManagingId])

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            setSubmitLoading(true)
            const formData = new FormData()

            formData.append("product_id",product.product_id)
            formData.append("product_name", product.product_name)
            formData.append("product_description", product.product_description)
            formData.append("stock", product.stock)
            formData.append("price", product.price)
            formData.append("category", product.category)
            
            if (newImageFile) {
                formData.append("product_image", newImageFile)
            }

            const response = await app.patch(`/admin/products`, formData)
            
            toast.success("Product updated successfully!")
            

            setProducts(prev => prev.map(p => 
                p.product_id === productManagingId ?{ ...p, ...product, product_image: imagePreview } : p
            ))
            
            setProductManagingId("")
            
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to update product")
        } finally {
            setSubmitLoading(false)
        }
    }

    if (isRateLimited) return <div className="h-full flex justify-center items-center"><RateLimit /></div>
    if (loading) return <div className="h-full flex justify-center items-center"><div className="animate-spin size-10 border-4 border-gray-200 border-t-blue-500 rounded-full"></div></div>

    return (
        <div className="min-h-full p-4 flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md p-6 border border-gray-100 bg-white rounded-2xl shadow-md">
                
                <div className="flex gap-2 items-center text-sm font-semibold mb-6 text-gray-600 pt-10 lg:pt-0">
                    <ArrowLeftCircle 
                        size={30} 
                        className="cursor-pointer hover:scale-105 hover:text-blue-500 transition-all duration-300"
                        onClick={() => setProductManagingId("")} 
                    />
                    Back to Dashboard
                </div>
                
                <p className="text-2xl mb-6 font-bold text-gray-900">Edit Product</p>
                
                <form className="flex flex-col gap-4 w-full" onSubmit={handleUpdate}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input required type="text" value={product.product_name}
                            onChange={(e) => setProduct(pre => ({ ...pre, product_name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Wireless Headphones" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                        <div className="w-full h-40 overflow-hidden border-2 border-gray-300 border-dashed flex justify-center items-center rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                            {imagePreview ? (
                                <label htmlFor="image" className="w-full h-full cursor-pointer relative group">
                                    <img src={imagePreview} alt="product" className="h-full w-full object-contain p-2" />

                                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-semibold">
                                        Change Image
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" id="image" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <label className="flex flex-col justify-center items-center gap-1 cursor-pointer w-full h-full" htmlFor="image">
                                    <ImageUpIcon size={30} className="text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-700">Upload new image</p>
                                    <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block mb-1 text-sm font-semibold text-gray-700">Category:</label>
                        <select id="category" value={product.category} onChange={(e) => setProduct(pre => ({ ...pre, category: e.target.value }))}
                            className="font-semibold text-sm text-gray-700 outline-none p-3 border rounded-lg cursor-pointer border-gray-300 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <option value="fashion">Fashion</option>
                            <option value="electronics">Electronics</option>
                            <option value="groceries">Groceries</option>
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-1 block">Price (₹)</label>
                            <input type="number" min="0" id="price" value={product.price} onChange={(e) => setProduct(pre => ({ ...pre, price: e.target.value }))}
                                className="p-3 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        
                        <div>
                            <label htmlFor="stock" className="text-sm font-semibold text-gray-700 mb-1 block">Current Stock</label>
                            <input type="number" min="0" id="stock" value={product.stock} onChange={(e) => setProduct(pre => ({ ...pre, stock: e.target.value }))}
                                className="p-3 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                        <textarea id="description" value={product.product_description} onChange={(e) => setProduct(pre => ({ ...pre, product_description: e.target.value }))}
                            required minLength={6} maxLength={200}
                            className="p-3 border border-gray-300 w-full outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24" />
                    </div>
                    
                    <button type="submit" disabled={submitLoading} className="bg-blue-500 text-white text-lg font-bold px-4 py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer disabled:bg-blue-300 flex justify-center mt-2">
                        {submitLoading ? <div className="animate-spin size-6 border-4 border-white border-t-transparent rounded-full"></div> : "Update Product"}
                    </button>
                </form>
            </div>
        </div>
    )
}