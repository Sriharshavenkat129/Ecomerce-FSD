import { useEffect, useState } from "react"
import RateLimit from "../components/RateLimit"
import app from "../utils/app"
import toast from "react-hot-toast"
import { ArrowLeftCircle, Package, PackageX, ShoppingCart } from "lucide-react"
import ProductCard from "../components/adminComponents/ProductCard"
import OrderCard from "../components/adminComponents/OrderCard"
import OrderDetail from "../components/adminComponents/OrderDetail"
import { useNavigate } from "react-router"
import ProductDetails from "../components/adminComponents/ProductDetails"

export default function Admin() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [mobileViewThing, setMobileViewThing] = useState("")
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [totalSales, setTotalSales] = useState()
    const [todaySales, setTodaySales] = useState()
    const [monthlySales, setMonthlySales] = useState()
    const [yearlySales, setYearlySales] = useState()
    const [orderManagingId,setOrderManagingId] = useState("")
    const [productmanagingId,setProductManagingId] = useState("")

    const values = ["Total orders", "Today", "This Month", "This Year"]

    useEffect(() => {
        const getAdminDashBoard = async () => {
            try {
                setLoading(true)
                const response = await app.get("/admin")
                const current_date = new Date()
                const data = response.data.data
                setTotalSales(data[0].total_orders)

                const today_data = data.find(pre => {
                    return pre.year == current_date.getFullYear() && pre.month == (current_date.getMonth() + 1) && pre.day == current_date.getDate()
                })
                setTodaySales(today_data?.total_orders || 0)

                const monthly_data = data.find(pre => {
                    return pre.year == current_date.getFullYear() && pre.month == (current_date.getMonth() + 1) && pre.day == null
                })
                setMonthlySales(monthly_data?.total_orders || 0)

                const year_data = data.find(pre => {
                    return pre.year == current_date.getFullYear() && pre.month == null && pre.day == null
                })
                setYearlySales(year_data?.total_orders || 0)

            }
            catch (error) {
                if (error.response?.status == 429) {
                    setIsRateLimited(true)
                    return toast.error("too many requests")
                }
                toast.error(error.response?.data.msg || "something went wrong")
            }
            finally {
                setLoading(false)
            }
        }
        getAdminDashBoard()
    }, [])

    useEffect(() => {
        const getDetails = async () => {
            try {
                setLoading(true)
                if (mobileViewThing == "") return;
                let response;
                if (mobileViewThing == "products") {
                    response = await app.get("/admin/products")
                    setProducts(response.data.data)
                }
                else if (mobileViewThing == "orders") {
                    response = await app.get("/admin/orders")
                    setOrders(response.data.data)
                }
            }
            catch (error) {
                if (error.response?.status == 429) {
                    setIsRateLimited(true)
                    return toast.error("too manhy requests")
                }
                return toast.error(error.response?.data.msg || "something went wrong")
            }
            finally {
                setLoading(false)
            }
        }
        if (mobileViewThing != "")
            getDetails()

    }, [mobileViewThing])


    if (loading) return (<div className="h-screen flex justify-center items-center">
        <div className="animate-spin size-10 border-4 border-gray-200 border-y-blue-500 rounded-full">
        </div>
    </div>)
    if (isRateLimited) return (
        <div className="h-screen justify-center items-center"><RateLimit /></div>
    )

    const productCards = products.map(pre => {
        return <ProductCard product={pre} key={pre.product_id} setProductManagingId={setProductManagingId} setProducts={setProducts}/>
    })

    const orderCards = orders.map(pre => {
        return <OrderCard key={pre.order_id} order={pre} setOrderManagingId={setOrderManagingId}/>
    })

    return (
        <div className="h-screen overflow-hidden">
            <div className="flex flex-col p-2 lg:flex-row gap-2 h-full">


                <div className={`lg:w-2/3 h-full min-h-0 flex-col gap-2 ${mobileViewThing != "" ? 'flex' : 'hidden'} lg:flex overflow-auto scrollbar-none`}>

                    {mobileViewThing != "" && (
                        <div className={`p-2 flex-none lg:hidden ${orderManagingId?"hidden":productmanagingId?"hidden":""}`}>
                            <ArrowLeftCircle size={30}
                                className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-102"
                                onClick={() => setMobileViewThing("")} />
                        </div>
                    )}
                    { (!orderManagingId && ! productmanagingId) &&
                    <div className={`flex-1 min-h-0 p-2 border border-gray-100 rounded-xl shadow-inner bg-gray-50/50 grid grid-cols-1 
                        ${mobileViewThing == "products" ? (productCards.length == 0 ? 'lg:grid-cols-1' : "lg:grid-cols-2") : (orders.length == 0 ? "lg:grid-cols-1" : "lg:grid-cols-2")}
                        gap-3 overflow-y-auto scrollbar-none content-start`}>
                        {mobileViewThing == "products" && (
                            <>
                                {productCards.length == 0 ? (
                                    <div className="h-full min-h-[300px] flex justify-center items-center flex-col gap-4 rounded-xl bg-white shadow-sm border border-gray-100">
                                        <ShoppingCart size={40} className="text-gray-400" />
                                        <p className="text-md font-semibold text-red-500">No Products at this moment</p>
                                        <button className="bg-blue-500 px-6 py-2 cursor-pointer rounded-md text-md font-semibold text-white 
                                            hover:bg-blue-600 transition-all duration-300 ease-in-out active:scale-95"
                                            onClick={() => navigate("/admin/product/new")}>+ Add product
                                        </button>
                                    </div>
                                ) : (
                                    productCards
                                )}
                            </>
                        )}

                        {mobileViewThing == "orders" && (
                            <>
                                {orderCards.length == 0 ? (
                                    <div className="h-full flex justify-center items-center flex-col gap-4 rounded-xl bg-white shadow-sm border border-gray-100">
                                        <PackageX size={40} className="text-gray-400" />
                                        <p className="text-md font-semibold text-red-500">No Orders for now!</p>
                                    </div>
                                ) : (
                                    orderCards
                                )}
                            </>
                        )}
                    </div>
                    }
                    {
                        orderManagingId && 
                        <>
                            <OrderDetail order_id={orderManagingId} setOrderManagingId={setOrderManagingId} setOrders={setOrders}/>
                        </>
                    }
                    {
                        productmanagingId &&
                        <>
                            <ProductDetails productManagingId={productmanagingId} setProductManagingId={setProductManagingId} setProducts={setProducts}/>
                        </>
                    }
                </div>
                <div className={`lg:w-1/3 p-4 rounded-xl h-full flex-none overflow-y-auto scrollbar-none flex flex-col shadow-md border border-gray-200 ${mobileViewThing != "" ? 'hidden lg:flex' : 'flex'}`}>
                    <p className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</p>

                    <div className="grid grid-cols-2 gap-3 font-semibold mb-6">
                        {[totalSales, todaySales, monthlySales, yearlySales].map((pre, index) => {
                            return (
                                <div className="border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer flex flex-col justify-center items-center p-4 bg-gray-50" key={index}>
                                    <p className="text-sm text-gray-500">{values[index]}</p>
                                    <p className="text-xl text-blue-600">{pre}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                        <button className={`p-3 border-blue-400 border-2 rounded-xl text-lg font-semibold
                            transition-all duration-300 ease-in-out hover:bg-blue-50 active:bg-blue-500 active:text-white
                            active:scale-95 cursor-pointer flex gap-3 items-center justify-center disabled:bg-blue-500 disabled:text-white`}
                            disabled={mobileViewThing == "orders"}
                            onClick={() => { setMobileViewThing("orders") }}>
                            <Package size={24} />
                            Orders
                        </button>

                        <button className={`p-3 border-blue-400 border-2 rounded-xl text-lg font-semibold
                            transition-all duration-300 ease-in-out hover:bg-blue-50 active:bg-blue-500 active:text-white
                            active:scale-95 cursor-pointer flex gap-3 items-center justify-center disabled:bg-blue-500 disabled:text-white`}
                            disabled={mobileViewThing == "products"}
                            onClick={() => { setMobileViewThing("products") }}>
                            <ShoppingCart size={24} />
                            Products
                        </button>

                        <button className="bg-green-500 p-3 mt-2 cursor-pointer rounded-xl text-lg font-bold text-white shadow-md
                            hover:bg-green-600 transition-all duration-300 ease-in-out active:scale-95 flex gap-2 justify-center items-center"
                            onClick={() => navigate("/admin/product/new")}>
                            + Add New Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}