import { IndianRupee } from "lucide-react";

export default function ProductOrderCard({ product, setProducts }) {
    return (
        // 1. Added h-full and bg-white to ensure the card fills the grid cell completely
        <div className="flex flex-col h-full border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white gap-3">
            
            <div className="overflow-hidden rounded-xl h-48 flex-shrink-0 bg-gray-50">
                <img 
                    src={product.product_image} 
                    alt={product.product_name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out" 
                />
            </div>

            <div className="flex flex-col flex-grow gap-2">
                <div className="flex justify-between items-start gap-2 text-lg font-semibold">
                    <p className="font-bold font-serif leading-tight text-gray-900">
                        {product.product_name}
                    </p>
                    <div className="flex items-center justify-center flex-shrink-0 text-blue-600">
                        <IndianRupee size={18} />
                        <p>{product.price}</p>
                    </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {product.product_description}
                </p>
                
                <p className={`text-sm font-semibold mt-1 ${product.stock <= 10 && product.stock > 0 ? "text-orange-500" : product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left in stock`}
                </p>
            </div>

            {product.cart_id && (
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-4 py-2 px-3 bg-gray-50 border border-gray-200 font-semibold rounded-lg focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                        <label className="text-sm text-gray-700">Quantity:</label>
                        <input 
                            type="number" 
                            min={1} 
                            max={product.stock} 
                            value={product.quantity} 
                            onChange={(e) => {
                                setProducts(pre => {
                                    return pre.map((p) => {
                                        if (p.product_id === product.product_id) {
                                            // Converted e.target.value to a Number to prevent weird string bugs
                                            return { ...p, quantity: Math.min(Number(e.target.value), p.stock) }
                                        }
                                        return p;
                                    });
                                });
                            }} 
                            className="outline-none bg-transparent w-full text-right  text-gray-900"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}