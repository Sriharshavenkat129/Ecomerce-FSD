import { Link } from "react-router"
import indexHome from "./IndexHome.jpg"
import groceriesImage from "./groceries.jpg"
import fashionImage from "./fashion.jpg"
import electronicsImage from "./electronics.jpeg"

export default function Main() {
    return (
        <main className="mt-8">
            <div id="home" className="flex gap-2 p-10">
                <div className="w-1/2">
                    <div className="object-cover">
                        <img src={indexHome} className="mask-x-from-80% mask-x-to-100% mask-y-from-80% mask-y-to-100%" />
                    </div>
                </div>
                <div className="w-1/2 flex justify-between items-start px-4 py-2 flex-col">
                    <h1 className="text-3xl font-bold">Welocme to our store</h1>
                    <p className="mb-auto mt-4 text-xl">
                        <b>we are glad you have here,  </b>
                        This is the website we sell our products directly from the merchants
                        without you need to visit any where and communicating with them and
                        you can find products realted Fashion, Electronics and groceries.
                        You can simply start using it by register here.
                    </p>
                    <div className="mb-20 mx-auto flex items-center gap-6">
                        <Link style={{ textDecoration: "none" }}
                            to="/login"
                        >
                            <button className="border-4 border-blue-400 cursor-pointer rounded-md px-4 py-0.5
                            text-xl font-bold text-black 
                            transition-all ease-in-out duration-300
                            hover:bg-blue-400 hover:text-white">Login</button>
                        </Link>
                        <Link style={{ textDecoration: "none" }}
                            to="/register"
                        >
                            <button className="border-4 border-blue-400 rounded-md px-4 py-0.5 text-xl 
                                bg-blue-400 text-white font-bold cursor-pointer
                                transition-all ease-in-out duration-300
                                hover:bg-white hover:text-black shrink-0 text-nowrap">
                                Start for free</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div id="products" className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-serif m-auto">Our products</h1>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-center items-center p-6 gap-2 w-1/3
                    transform-all duration-100 ease-in-out hover:scale-102 cursor-pointer">
                        <h1 className="text-2xl font-bold">Electronics</h1>
                        <img src={electronicsImage} className="w-100 h-80 hover:shadow-xl object-cover rounded-2xl"/>
                    </div>
                    <div className="flex flex-col justify-center items-center p-6 gap-2 w-1/3
                    transform-all duration-100 ease-in-out hover:scale-102 cursor-pointer">
                        <h1 className="text-2xl font-bold">Fashion</h1>
                        <img src={fashionImage} className="w-100 h-80 object-cover  hover:shadow-xl rounded-2xl"/>
                    </div>
                    <div className="flex flex-col justify-center items-center p-6 gap-2 w-1/3
                    transform-all duration-100 ease-in-out hover:scale-102 cursor-pointer">
                        <h1 className="text-2xl font-bold">Groceries</h1>
                        <img src={groceriesImage} className="w-100 h-80 object-cover rounded-xl hover:shadow-2xl"/>
                    </div>
                </div>
            </div>
        </main>
    )
}