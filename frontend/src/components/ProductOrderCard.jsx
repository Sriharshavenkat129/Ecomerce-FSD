import { IndianRupee } from "lucide-react";

export default function ProductOrderCard({product,setProducts}){
    return(
        <div className="flex flex-col gap-3 border border-gray-100 p-2 rounded-2xl shadow-md">
            <div className="overflow-hidden rounded-xl">
                <img src={product.product_image} className="object-cover rounded-xl w-full hover:scale-104 
                transition-all duration-300 ease-in-out"/>
            </div>
            <div className="flex justify-between items-center text-xl font-semibold">
                <p className="font-bold font-serif">
                    {product.product_name}
                </p>
                <div className="flex items-center justify-center text-balance">
                    <IndianRupee size={20}/>
                    <p>{product.price}/-</p>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {product.product_description}
                </p>
                <p className={`text-md font-semibold mt-1 ${product.stock <= 10 && product.stock > 0 ? "text-orange-500" : product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                    {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left in stock`}
                </p>
                {   product.cart_id &&
                    <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 border border-gray-200 py-1 px-0.5 font-semibold rounded-md">
                        <label>Quantity:</label>
                        <input type="number" min={1} max={product.stock} value={product.quantity} onChange={(e)=>{
                            setProducts(pre=>{
                                const products=pre.map((p)=>{
                                if(p.product_id==product.product_id)
                                    return {...p,"quantity":Math.min(e.target.value,p.stock)}
                                return p
                            })
                            return products
                            })
                        }} className="outline-none w-full"></input>
                    </div>
                    <div>

                    </div>
                    </div>
                }
            </div>
        </div>
    )
}