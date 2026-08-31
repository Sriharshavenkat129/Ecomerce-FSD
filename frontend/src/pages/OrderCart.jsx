import { ArrowLeft, IndianRupee, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import app from "../utils/app"
import toast from "react-hot-toast";
import ProductOrderCard from "../components/ProductOrderCard.jsx";
import AddressRadio from "../components/AddressRadio.jsx";
import AddAddress from "../components/AddAddress.jsx";
import RateLimit from "../components/RateLimit.jsx";

export default function OrderCart() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [loading, setLoading] = useState(true)
    const [orderPlacingStatus, setOrderPlacingStatus] = useState(false)
    const [orderData, setOrderData] = useState({
        "address_id": "",
        "payment_type": "",
        "cartedProducts": []
    })
    const [addresses, setAddresses] = useState([])
    const [addAddressStatus, setAddAddressStatus] = useState(false)

    useEffect(() => {
        const getAllAddresses = async () => {
            try {
                setLoading(true)
                const response = await app.get("/user/me/address")
                setAddresses(response.data.data)
            }
            catch (error) {
                if (error.response.status == 429) {
                    setIsRateLimited(true)
                    return toast.error(error.response.data)
                }
                else toast.error(error.response.data.msg || "something went wrong")
            }
            finally {
                setLoading(false)
            }
        }
        getAllAddresses()
    }, [])

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true)
                const response = await app.get("/user/me/cart")
                const products = response.data.data.map(pre => ({ ...pre, "quantity": 1 }))
                setProducts(products)
            }
            catch (error) {
                if (error.response.status == 429) {
                    setIsRateLimited(true)
                    return toast.error(error.response.data)
                }
                else toast.error(error.response.data.msg || "something went wrong")
            }
            finally {
                setLoading(false)
            }
        }
        getProducts()
    }, [])

    let totalAmount = 0;
    const filterProducts = products.filter(pre => { return pre.is_available && pre.stock > 0 })
    const productCards = filterProducts.map(pre => {
        totalAmount += (pre.quantity * pre.price)
        return <ProductOrderCard product={pre} setProducts={setProducts} key={pre.cart_id} />
    })

    const addressCards = addresses.map(pre => {
        return <AddressRadio address={pre} setAddressId={setOrderData} key={pre.address_id} />
    })

    useEffect(() => { setOrderData(pre => ({ ...pre, "cartedProducts": filterProducts })) }, [products])
    const PlaceOrder = async () => {
        try {
            setLoading(true)
            const response = await app.post("/user/me/cart/order", orderData)
            toast.success(response.data.msg)
            setOrderPlacingStatus(false)
        }
        catch (error) {
            if (error.response.status == 429) {
                setIsRateLimited(true)
                return toast.error(error.response.data)
            }
            else toast.error(error.response.data.msg || "something went wrong")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-h-screen min-h-screen flex flex-col">
            {!isRateLimited &&
                <>
                    {!orderPlacingStatus &&
                        <>
                            <header className="p-2 border border-gray-100 shadow-sm">
                                <ArrowLeft className="cursor-pointer size-8 md:size-10" onClick={() => { navigate("/cart") }} />
                            </header>
                            <main className="mb-auto overflow-auto scrollbar-none">
                                {
                                    (productCards.length == 0 && !loading) &&
                                    <div className="flex  flex-col gap-2 justify-center items-center h-screen">
                                        <ShoppingBag size={60} />
                                        <p className="text-md font-semibold">No products available for order</p>
                                    </div>
                                }
                                {
                                    (productCards.length > 0 && !loading) &&
                                    <div className="p-4 gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {productCards}
                                    </div>
                                }
                                {
                                    loading &&
                                    <div className="flex w-full h-screen justify-center items-center">
                                        <div className="animate-spin size-10 rounded-full border-4 border-blue-400 border-t-gray-200"></div>
                                    </div>
                                }
                            </main>
                            <footer className="static bottom-0 left-0 right-0 px-10 pb-4">
                                <div className="w-full p-4 border border-gray-200 rounded-4xl shadow-2xl flex justify-between gap-2 items-center">
                                    <p className="text-md md:text-xl font-semibold flex items-center"><span>Total amount :</span> <IndianRupee size={20} className="mt-1" />{totalAmount}/-</p>
                                    <button className="bg-orange-400 hover:bg-orange-500 font-semibold text-md md:text-xl py-2 px-4 rounded-xl
                    transition-all duration-300 ease-in-out active:scale-98 cursor-pointer
                    disabled:bg-orange-200 disabled:text-gray-400"
                                        disabled={productCards.length == 0}
                                        onClick={() => { setOrderPlacingStatus(true) }}>Order now</button>
                                </div>
                            </footer>
                        </>
                    }
                    {
                        (orderPlacingStatus && !addAddressStatus) &&
                        <>  {loading &&
                            <div className="flex w-full h-screen justify-center items-center">
                                <div className="animate-spin size-10 rounded-full border-4 border-blue-400 border-t-gray-200"></div>
                            </div>
                        }
                            {!loading &&
                                <div className="h-screen w-full flex justify-center items-center p-3">
                                    <div className="w-full sm:w-md flex flex-col gap-2 p-2  border-gray-200 shadow-xl rounded-xl">
                                        <div className="flex justify-start px-2 py-0.5 w-full">
                                            <ArrowLeft size={30} onClick={() => setOrderPlacingStatus(false)} className="cursor-pointer" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div>
                                                {addressCards}
                                            </div>
                                            <div className="flex justify-end px-2 py-0.5">
                                                <button className="bg-blue-400 text-md font-semibold
                                    hover:bg-blue-500 text-white rounded-md py-1 px-4 active:bg-blue-400
                                    cursor-pointer active:scale-98 transition-all duration-300 ease-in-out"
                                                    onClick={() => setAddAddressStatus(true)}>+ New address</button>
                                            </div>
                                        </div>
                                        <p className="text-md md:text-xl font-semibold flex items-center"><span>Total amount :</span> <IndianRupee size={20} className="mt-1" />{totalAmount}/-</p>
                                        <div className="flex gap-2 text-md font-semibold">
                                            <p>Payment type :</p>
                                            <div className="flex gap-5 font-semibold">
                                                <label className="flex gap-2 items-center cursor-pointer"><input type="radio" name="payment"
                                                    onChange={(e) => setOrderData(pre => ({ ...pre, "payment_type": "cod" }))} value="cod"
                                                    className="cursor-pointer" />COD</label>
                                                <label className="flex gap-2 items-center cursor-pointer"><input type="radio" name="payment"
                                                    onChange={(e) => setOrderData(pre => ({ ...pre, "payment_type": "upi" }))} value="upi"
                                                    className="cursor-pointer" />UPI</label>
                                            </div>
                                        </div>
                                        <div className="flex w-full"><button className="w-full felx justify-center px-4 py-2 rounded-2xl 
                                bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-all duration-300
                                ease-in-out active:scale-98 active:bg-orange-400 cursor-pointer"
                                            onClick={() => { PlaceOrder() }}>Place Order</button></div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                    {
                        (addAddressStatus && orderPlacingStatus) &&
                        <div className="h-screen flex justify-center items-center">
                            <AddAddress setAddAddressStatus={setAddAddressStatus} setAddresses={setAddresses} Addresses={addresses} />
                        </div>
                    }
                </>
            }
            {
                isRateLimited &&
                <div className="flex min-h-screen justify-center items-center p-4">
                    <RateLimit />
                </div>
            }
        </div>
    )
}