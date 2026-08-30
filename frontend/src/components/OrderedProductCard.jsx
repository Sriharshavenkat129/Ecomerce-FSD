import {IndianRupee} from "lucide-react"
import {useNavigate} from "react-router"

export default function OrderedProductCard({ order }) {

    const navigate=useNavigate()

    return (
        <div className="flex flex-col bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 w-full"
        onClick={()=>navigate(`order/${order.order_id}`)}>

            <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-50">
                <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="flex flex-col grow gap-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold font-serif text-gray-900 truncate">
                        {order.product_name}
                    </h3>
                    <p className="flex items-center text-xl font-bold text-gray-900 shrink-0">
                        <IndianRupee size={18} strokeWidth={2.5} className="mr-0.5" />
                        {order.unit_price}
                    </p>
                </div>
            </div>
            <div className="flex flex-col grow gap-2 mb-auto">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold font-serif text-gray-900 truncate">
                        Quantity:{order.quantity}
                    </h3>
                    <p className="flex items-center text-xl font-bold text-gray-900 shrink-0">
                        <IndianRupee size={18} strokeWidth={2.5} className="mr-0.5" />
                        Total Amount:{order.unit_price*order.quantity}
                    </p>
                </div>
            </div>
            <div>
                <button className={`text-xl font-semibold
                     ${order.status=="created"?"text-blue-500 bg-blue-100":order.status=="delivered"?
                     "text-green-500 bg-green-100":order.status=="returned"?
                     "text-orange-500 bg-orange-100":"text-red-500 bg-red-100"}
                     py-1 px-4 rounded-2xl mt-2`}
                     disabled={true}>
                    {order.status}</button>
            </div>
        </div>
    )
}