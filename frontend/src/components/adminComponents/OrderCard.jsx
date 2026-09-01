export default function OrderCard({ order ,setOrderManagingId }) {
    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    return (
        <div
            className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer h-full group"
            onClick={()=>{setOrderManagingId(order.order_id)}}>

            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                    <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        Order #{order.order_id}
                    </p>
                    <p className="text-xs text-gray-500">{orderDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'created' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {order.status || 'created'}
                </span>
            </div>

            <div className="flex gap-3 items-center mt-1">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    {order.product_image ? (
                        <img src={order.product_image} alt={order.product_name} className="w-full h-full object-cover" />
                    ) : (
                        <Package size={24} className="m-auto h-full text-gray-400" />
                    )}
                </div>
                <p className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug">
                    {order.product_name}
                </p>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <div className="text-gray-500 font-medium">
                    {order.quantity} {order.quantity === 1 ? 'item' : 'items'} × ₹{order.unit_price}
                </div>
                <div className="font-bold text-gray-900 text-base">
                    Total: <span className="text-blue-600">₹{order.quantity * order.unit_price}</span>
                </div>
            </div>

        </div>
    )
}