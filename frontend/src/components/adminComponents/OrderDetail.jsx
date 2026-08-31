import { useEffect, useState } from "react";
import app from "../../utils/app";
import toast from "react-hot-toast";
import RateLimit from "../../components/RateLimit.jsx";
import { ArrowLeft, Package, MapPin, CreditCard, UserRoundCheck } from "lucide-react";

export default function OrderDetails({order_id,setOrderManagingId,setOrders}) {
    const [isRateLimited,setIsRateLimited]=useState(false)
    const [loading,setLoading] = useState(true)
    const [order,setOrder] = useState()

    useEffect(()=>{
        async function getOrder(){
            try{
                setLoading(true)
                const response=await app.get(`admin/orders/${order_id}`)
                setOrder(response.data.data)
            }
            catch(error){
                if(error.response?.status==429){
                    setIsRateLimited(true)
                    return toast.error("too many requests!")
                }
                toast.error(error.response?.data.msg || "something went wrong!")
            }
            finally{
                setLoading(false)
            }
        } 
        getOrder()
    },[])

    const handleDelivery=async ()=>{
        try{
            const response=await app.patch("admin/orders",{order_id})
            setOrders(prevOrders => 
                prevOrders.map(o => 
                    o.order_id === order_id ? { ...o, status: "delivered" } : o
                )
            );
            toast.success(response.data.msg)
            setOrderManagingId("")
        }
        catch(error){
                if(error.response?.status==429){
                    setIsRateLimited(true)
                    return toast.error("too many requests!")
                }
                toast.error(error.response?.data.msg || "something went wrong!")
        }
        finally{

        }
    }

    if (isRateLimited) return <div className="h-screen flex justify-center items-center"><RateLimit /></div>;
    if (loading) return <div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full size-10 border-4 border-blue-400 border-t-gray-300"></div></div>;
    if (!order) return <div className="h-screen flex justify-center items-center text-xl font-bold">Order not found</div>;



    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return 'bg-green-100 text-green-700';
        if (s === 'cancelled') return 'bg-red-100 text-red-700';
        return 'bg-blue-100 text-blue-700'; 
    };
    return (
        <div className={`min-h-screen bg-gray-50 p-4 md:p-8`}>
            {
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                
                <div className="flex items-center gap-4 mb-2">
                    <button 
                        onClick={() => setOrderManagingId("")} 
                        className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
                    <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 h-62 sm:h-32 bg-gray-100 rounded-xl shrink-0 overflow-hidden border border-gray-200">
                        {order.product_image ? (
                            <img src={order.product_image} alt={order.product_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={40} /></div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{order.product_name}</h2>
                        <p className="text-gray-600 mb-1">Unit Price: <span className="font-semibold text-gray-900">₹{order.unit_price}</span></p>
                        <p className="text-gray-600">Quantity: <span className="font-semibold text-gray-900">{order.quantity}</span></p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="felx items-center gap-2 mb-2 pl-8">
                            <UserRoundCheck size={24} className="text-orange-500"/>
                            <h3 className="text-lg font-bold text-gray-700">User Details</h3>
                        </div>
                        <div className="pl-8 flex flex-col gap-1 mb-2">
                            <p className="font-bold text-black">User Name:<span className="font-semibold text-gray-700">{order.name}</span></p>
                            <p className="font-bold text-black">Email:<span className="font-semibold text-gray-700">{order.email}</span></p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-blue-500" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
                        </div>
                        <div className="pl-8 flex flex-col gap-1 text-gray-700">
                            <p className="font-semibold text-black">{order.location}</p>
                            <p>{order.state}</p>
                            <p>Pincode: <span className="font-semibold">{order.pincode}</span></p>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="text-blue-500" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
                        </div>
                        <div className="pl-8 flex flex-col gap-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-semibold uppercase">{order.payment_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Transaction ID:</span>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{order.transaction_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Status:</span>
                                <span className={`font-semibold capitalize ${order.payment_status?.toLowerCase() === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Total Amount:</span>
                                <span className="font-bold text-blue-600">₹{order.total_amount}</span>
                            </div>
                        </div>
                    </section>
                </div>
                    <div className="flex justify-end w-full">
                        {order.status=="created" &&
                        <button className="text-white bg-green-400 hover:bg-green-500 rounded-xl font-semibold text-md py-2 px-4 lg:px-20 lg:text-xl
                        transition-all duration-300 ease-in-out cursor-pointer active:scale-98 text-nowrap"
                        onClick={()=>{handleDelivery()}}>
                        Mark Delivered
                        </button>
                        }
                    </div>
            </div>
            }
        </div>
    );
}