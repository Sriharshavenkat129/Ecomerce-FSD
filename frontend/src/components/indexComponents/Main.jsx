import { Link } from "react-router";
import indexHome from "./IndexHome.jpg";
import groceriesImage from "./groceries.jpg";
import fashionImage from "./fashion.jpg";
import electronicsImage from "./electronics.jpeg";

export default function Main() {
    return (
        <main className="pt-24 pb-12 max-w-7xl mx-auto">
            
            <div id="home" className="flex flex-col md:flex-row gap-8 items-center px-4 md:px-10">
                <div className="w-full md:w-1/2">
                    <img 
                        src={indexHome} 
                        className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500" 
                        alt="Store welcome"
                    />
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Welcome to our store
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        <b className="text-gray-900">We are glad you are here. </b>
                        This is the website where we sell our products directly from the merchants
                        without you needing to visit anywhere. You can find products related to Fashion, Electronics, and Groceries.
                        Start exploring by registering below.
                    </p>
                    
                    <div className="flex gap-4 pt-4">
                        <Link to="/login">
                            <button className="cursor-pointer px-6 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all duration-300 active:scale-95">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="cursor-pointer px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 active:scale-95">
                                Start for free
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div id="products" className="mt-24 px-4 md:px-10">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-10">Our Products</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="group cursor-pointer flex flex-col gap-3">
                        <div className="overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500">
                            <img src={electronicsImage} className="w-full h-64 md:h-80 object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Electronics"/>
                        </div>
                        <h3 className="text-2xl font-bold text-center group-hover:text-blue-600 transition-colors">Electronics</h3>
                    </div>

                    <div className="group cursor-pointer flex flex-col gap-3">
                        <div className="overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500">
                            <img src={fashionImage} className="w-full h-64 md:h-80 object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Fashion"/>
                        </div>
                        <h3 className="text-2xl font-bold text-center group-hover:text-blue-600 transition-colors">Fashion</h3>
                    </div>

                    <div className="group cursor-pointer flex flex-col gap-3">
                        <div className="overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500">
                            <img src={groceriesImage} className="w-full h-64 md:h-80 object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Groceries"/>
                        </div>
                        <h3 className="text-2xl font-bold text-center group-hover:text-blue-600 transition-colors">Groceries</h3>
                    </div>
                    
                </div>
            </div>
        </main>
    );
}