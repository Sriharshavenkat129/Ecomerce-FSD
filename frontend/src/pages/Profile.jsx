import { useEffect, useState } from "react"
import app from "../utils/app.js"
import toast from "react-hot-toast"
import RateLimit from "../components/RateLimit.jsx"
import OrderProductCard from "../components/OrderedProductCard.jsx"
import AddressCard from "../components/AddressCard.jsx"
import AddAddress from "../components/AddAddress.jsx"
import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

export default function Profile() {

    const [orders, setOrders] = useState([])
    const [userDetails, setUserDetails] = useState()
    const [Addresses, setAddresses] = useState()
    const [loading, setLoading] = useState(true)
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [addAddressStatus, setAddAddressStatus] = useState(false)
    const [showMobileOrders, setShowMobileOrders] = useState(false);
    const navigate = useNavigate()

   useEffect(() => {
        const fetchAllProfileData = async () => {
            try {
                setLoading(true);

                const [ordersRes, addressRes, profileRes] = await Promise.allSettled([
                    app.get("/user/me/orders"),
                    app.get("/user/me/address"),
                    app.get("/user/me/profile")
                ]);

                const hitRateLimit = [ordersRes, addressRes, profileRes].some(
                    res => res.status === "rejected" && res.reason?.response?.status === 429
                );

                if (hitRateLimit) {
                    setIsRateLimited(true);
                    toast.error("Too many requests!");
                    return; 
                }

                
                setOrders(
                    ordersRes.status === "fulfilled" ? (ordersRes.value.data.data || []) : []
                );
                
                setAddresses(
                    addressRes.status === "fulfilled" ? (addressRes.value.data.data || []) : []
                );
                
                setUserDetails(
                    profileRes.status === "fulfilled" ? (profileRes.value.data.data || {}) : {}
                );

            } catch (error) {
                toast.error("Network error while loading profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProfileData();
    }, []);

    const orderProductCards = orders.map(order => <OrderProductCard order={order} key={order.order_id} />)

    return (
        <div className="h-screen overflow-hidden p-2 flex flex-col gap-2">
            {!isRateLimited &&
                <>
                    {!loading &&
                        <>
                            <div className="flex-none h-10 rounded-xl px-2 items-center">
                                <ArrowLeft size={40} onClick={() => navigate("/Home")} className="cursor-pointer" />
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">

                                <div className={`lg:w-2/3 h-full min-h-0 flex-col gap-2 ${showMobileOrders ? 'flex' : 'hidden'} lg:flex`}>

                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-semibold">Your Orders:</p>
                                        <button
                                            className="lg:hidden text-sm font-semibold bg-gray-200 px-3 py-1 rounded-lg"
                                            onClick={() => setShowMobileOrders(false)}
                                        >
                                            ← Back to Profile
                                        </button>
                                    </div>

                                    <div className="border-gray-100 shadow-xl border rounded-2xl p-2 flex-1 overflow-y-auto scrollbar-none grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 content-start">
                                        {orderProductCards.length === 0 && (
                                            <p className="font-semibold text-xl text-red-500 m-auto col-span-full">You don't have any orders yet!</p>
                                        )}
                                        {orderProductCards.length > 0 && orderProductCards}
                                    </div>
                                </div>

                                <div className={`lg:w-1/3 h-full min-h-0 flex-col ${!showMobileOrders ? 'flex' : 'hidden'} lg:flex`}>

                                    {!addAddressStatus ? (
                                        <div className="border-gray-100 shadow-xl border rounded-2xl h-fit max-h-full overflow-y-auto p-4 flex flex-col gap-2">
                                            <h2 className="font-bold text-xl mb-2">My Profile</h2>
                                            <p>Name: {userDetails?.name || "Loading..."}</p>

                                            <button
                                                className="lg:hidden w-full font-semibold bg-black text-white px-4 py-2 rounded-xl my-2"
                                                onClick={() => setShowMobileOrders(true)}
                                            >
                                                View My Orders
                                            </button>

                                            <div className="flex flex-col gap-3">
                                                <h3 className="font-bold text-lg text-gray-800">Saved Addresses</h3>

                                                {Addresses?.length === 0 && (
                                                    <p className="text-sm text-gray-500">You don't have any saved addresses yet.</p>
                                                )}
                                                {Addresses?.length > 0 && Addresses.map(addr => (
                                                    <AddressCard key={addr.address_id} address={addr} />
                                                ))}

                                                <button
                                                    className="mt-2 w-full font-semibold bg-blue-100 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors duration-300 cursor-pointer"
                                                    onClick={() => setAddAddressStatus(true)}
                                                >
                                                    + Add New Address
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <AddAddress
                                            setAddAddressStatus={setAddAddressStatus}
                                            Addresses={Addresses}
                                            setAddresses={setAddresses}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    }
                    {
                        loading &&
                        <div className="h-full flex justify-center items-center">
                            <div className="animate-spin rounded-full size-10 border-4 border-blue-400 border-t-gray-300"></div>
                        </div>
                    }
                </>
            }
            {
                isRateLimited &&
                <div className="h-full flex justify-center items-center">
                    <RateLimit />
                </div>
            }
        </div>
    )
}