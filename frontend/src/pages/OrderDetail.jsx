import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import app from "../utils/app";
import toast from "react-hot-toast";
import RateLimit from "../components/RateLimit.jsx";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";

export default function OrderDetails() {
    const params= useParams();
    const order_id=params.order_id
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [quantity,setQuantity] = useState(1);
    const [cancelStatus,setCancelStatus] = useState(false)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await app.get(`/user/me/orders/${order_id}`);
                setOrder(response.data.data);
            } catch (error) {
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                    return toast.error("Too many requests!");
                }
                toast.error(error.response?.data?.msg || "Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };

        if (order_id) fetchOrderDetails();
    }, [order_id]);

    const paynow=async()=>{
        try{
            setLoading(true)
            const response=await app.patch("/user/me/orders/paynow",{"order_id":order_id})
            toast.success(response.data.msg)
        }
        catch(error){
            if(error.response.status==429){
                setIsRateLimited(true)
                return toast.error(error.response.data)
            }
            return toast.error(error.response.data.msg || "something went wrong!")
        }
        finally{    
            setLoading(false)
        }
    }

    const returnOrCancel=async ()=>{
        try{
            setLoading(true)
            let response;
            if(order.status=="created")
                response=await app.patch("/user/me/orders/cancel",{"order_id":order_id ,"product_id":order.product_id,"transaction_id":order.transaction_id,quantity})
            if(order.status=="delivered")
                response=await app.post("/user/me/orders/return",{quantity,order_id})
            toast.success(response.data.msg)
            setCancelStatus(false)
            navigate(-1)
        }
        catch(error){
            if(error.response.status==429){
                setIsRateLimited(true)
                return toast.error(error.response.data)
            }
            return toast.error(error.response.data.msg || "something went wrong!")
        }
        finally{    
            setLoading(false)
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
        <main className={`min-h-screen bg-gray-50 p-4 md:p-8 ${cancelStatus?"items-center justify-center flex":""}`}>
            { !cancelStatus &&
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                
                <div className="flex items-center gap-4 mb-2">
                    <button 
                        onClick={() => navigate(-1)} 
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
                    <div className="flex justify-between gap-4">
                        { (order.status=="delivered" || order.status=="created") &&
                        <button className="cursor-pointer border-2 border-red-500 hover:bg-red-100 rounded-xl font-semibold text-md py-2 px-4 lg:px-20 lg:text-xl
                        transition-all duration-300 ease-in-out active:scale-98"
                        onClick={()=>setCancelStatus(true)}>
                            {order.status=="delivered"?"return":order.status=="created"?"cancel":""}
                        </button>
                        }
                        {order.payment_status=="pending" &&
                        <button className="cursor-pointer text-white bg-orange-400 hover:bg-orange-500 rounded-xl font-semibold text-md py-2 px-4 lg:px-20 lg:text-xl
                        transition-all duration-300 ease-in-out  active:scale-98 text-nowrap"
                        onClick={()=>paynow()}>
                        Pay Now
                        </button>
                        }
                    </div>

            </div>
            }
            {
                cancelStatus &&
                <div className="flex justify-center items-center flex-col p-2 border border-gray-50 shadow-xl rounded-2xl sm:w-sm
                text-md lg:text-xl font-semibold">
                        <div className="flex justify-start py-2 w-full"><ArrowLeft size={40} onClick={()=>setCancelStatus(false)}/></div>
                        <label htmlFor="quantity" className="flex flex-row rounded-2xl flex-start gap-2 border-2 w-full p-2 border-gray-200">
                            <span>Quantity :</span>
                            <input type="number" min={1} max={order.quantity} value={quantity} onChange={(e)=>setQuantity(Math.min(order.quantity,e.target.value))}
                            className="outline-none"/>
                        </label>
                        <button className="cursor-pointer border-2 border-red-500 hover:bg-red-100 rounded-xl font-semibold text-md py-2 px-4 lg:px-20 lg:text-xl
                        transition-all mt-2 w-full duration-300 ease-in-out active:scale-98"
                        onClick={()=>returnOrCancel()}>
                            {order.status=="delivered"?"return":order.status=="created"?"cancel":""}
                        </button>
                </div>
            }
        </main>
    );
}