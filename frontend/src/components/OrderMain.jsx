import { useEffect, useState } from "react"
import app from "../utils/app"
import toast from "react-hot-toast";
import RateLimit from "./RateLimit";
import { useParams } from "react-router";
import ProductOrderCard from "./ProductOrderCard";
import AddressRadio from "./addressRadio";
import AddAddress from "./AddAddress";

export default function OrderMain() {
    const [orderData, setOrderData] = useState({ "quantity": 1 })
    const [loading, setLoading] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [Addresses, setAddresses] = useState([]);
    const [addAddressStatus, setAddAddressStatus] = useState(false);
    const [isRateLimited, setRateLimited] = useState(false)
    const [product, setProduct] = useState()
    const params = useParams()

    useEffect(() => {
        async function getAddresses() {
            try {
                setLoading(true)
                const result = await app.get("/user/me/address")
                setAddresses(result.data.data)
            }
            catch (error) {
                if (error.response.staus == 404) {
                    return
                }
                if (error.response.staus == 429) {
                    setRateLimited(true)
                    toast.error(error.response)
                }
                else toast.error(error.response.data.msg)
            }
            finally {
                setLoading(false)
            }
        }
        getAddresses()
    }, [])
    useEffect(() => {
        async function getProduct() {
            const product_id = useParams.product_id
            try {
                setLoading(true)
                const result = await app.get(`/user/product/${params.product_id}`)
                setProduct(result.data.data)
            }
            catch (error) {
                if (error.response.status == 429) {
                    setRateLimited(true)
                    toast.error(error.response)
                }
                else toast.error(error.response.data?.msg || "something went wrong")
            }
            finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [])

    const addressCards = Addresses.map(address => <AddressRadio key={address.address_id} address={address} setAddressId={setOrderData} />)



    return (
        <main className="flex justify-center items-center min-h-screen">
            {(!loading && !ordered && !isRateLimited && product && !addAddressStatus) &&
                <section className="flex flex-col gap-6 p-4 w-full max-w-md border border-gray-100 shadow-2xl rounded-xl">
                    <div>
                        <ProductOrderCard product={product} />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        {Addresses.length == 0 && <p>no saved addresses</p>}
                        {Addresses.length > 0 &&
                            addressCards
                        }
                        <div className="ml-auto"><button className="font-semibold bg-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500
                    transition-bg duration-300 ease-in-out cursor-pointer active:bg-blue-400" onClick={() => setAddAddressStatus(true)}>+ New Address</button></div>
                    </div>
                    <div className="border rounded-md pl-2 pr-1 py-0.5 border-gray-200">
                        <label className="flex items-center font-semibold text-md">
                            Quantity: <input type="number" min={1} max={product.stock} value={orderData.quantity}
                                onChange={(e) => { setOrderData(pre => ({ ...pre, "quantity": Math.min(e.target.value, product.stock) })) }}
                                className="w-full outline-none pl-3" />
                        </label>
                    </div>
                    <div className="flex gap-3 items-center border rounded-md px-2 py-1 pr-5 border-gray-200">
                        <p className="flex items-center font-bold">Total: {orderData.quantity * product.price}/-</p>
                        <p className="text-md font-semibold ml-auto">Payment type: </p>
                        <div className="flex gap-5 font-semibold">
                            <label className="flex gap-2 items-center cursor-pointer"><input type="radio" name="payment"
                                onChange={(e) => setOrderData(pre => ({ ...pre, "payment_type": "cod" }))} value="cod"
                                className="cursor-pointer" />COD</label>
                            <label className="flex gap-2 items-center cursor-pointer"><input type="radio" name="payment"
                                onChange={(e) => setOrderData(pre => ({ ...pre, "payment_type": "upi" }))} value="upi"
                                className="cursor-pointer" />UPI</label>
                        </div>
                    </div>
                    <button className="bg-orange-400 p-2 rounded-2xl text-lg hover:rounded-3xl font-semibold hover:bg-orange-500
                cursor-pointer transition-all duration-300 ease-in-out active:scale-99 active:bg-orange-400">
                        Place Order
                    </button>
                </section>
            }
            {(!loading && ordered && !isRateLimited) &&
                <section>
                    <div>

                    </div>
                </section>
            }
            {
                loading &&
                <div className="animate-pulse sise-20 rounded-xl bg-black"></div>
            }
            {
                isRateLimited &&
                <RateLimit />
            }
            {
                addAddressStatus &&
                <AddAddress setAddAddressStatus={setAddAddressStatus} setAddresses={setAddresses} Addresses={Addresses}/>
            }
        </main>
    )
}