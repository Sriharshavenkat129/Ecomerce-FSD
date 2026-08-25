import { IndianRupee } from "lucide-react";

export default function ProductOrderCard({product}){
    return(
        <div className="flex flex-col gap-3">
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
            </div>
        </div>
    )
}