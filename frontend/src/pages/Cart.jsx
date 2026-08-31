import { ArrowLeft, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import app from '../utils/app'
import toast from "react-hot-toast";
import CartedProductCard from "../components/CartedProductCard.jsx";

export default function Cart() {
    const navigate = useNavigate()
    const [cartedProducts, setCartedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getCartedProducts = async () => {
            try {
                setLoading(true)
                const response = await app.get("/user/me/cart")
                setCartedProducts(response.data.data)
            }
            catch (error) {
                toast.error(error.response.data.msg || "soemthing went wrong!")
            }
            finally {
                setLoading(false)
            }
        }
        getCartedProducts()
    }, [])

    const productCards = cartedProducts.map(pre => { return <CartedProductCard key={pre.cart_id} product={pre} setCartedProducts={setCartedProducts} /> })

    return (
        <>
            <header className="w-full flex justify-between items-center py-2 px-4 shadow-2xs">
                <ArrowLeft size={40} className="cursor-pointer" onClick={() => navigate('/Home')} />
                <button className="bg-blue-400 px-4 py-2 rounded-xl font-semibold text-md text-white hover:bg-blue-500 active:scale-98
                transition-all duration-300 ease-in-out cursor-pointer active:bg-blue-400 disabled:bg-blue-200"
                onClick={()=>{navigate('order')}}
                disabled={cartedProducts.length==0}>Order from cart</button>
            </header>
            <main>
                {(cartedProducts.length == 0 && !loading) &&
                    <div className="flex flex-col gap-4 justify-center items-center h-screen">
                        <ShoppingCart size={60} />
                        <p className="font-semibold text-xl text-red-500">No products found in the cart</p>
                        <button className="bg-blue-400 hover:bg-blue-500 text-md font-semibold 
                        transition-all duration-300 ease-in-out cursor-pointer p-2 px-4 active:scale-98 rounded-xl text-white"
                            onClick={() => navigate("/Home")}>
                            Explore products
                        </button>
                    </div>
                }
                {(cartedProducts.length > 0 && !loading) &&
                    <section className="p-2 flex flex-col md:flex-row gap-2">
                        <div className="md:max-h-screen overflow-scroll scrollbar-none grid lg:grid-cols-4 gap-2 md:grid-cols-3 grid-cols-1">
                            {productCards}
                        </div>
                    </section>
                }
                {loading &&
                    <div className="flex justify-center items-center h-screen flex-col gap-4">
                        <div className="animate-spin size-10  rounded-full border-4 border-t-gray-200 border-blue-400 "></div>
                        <p className="font-semibold text-xl">Loading..</p>
                    </div>
                }
            </main>
        </>
    )
}