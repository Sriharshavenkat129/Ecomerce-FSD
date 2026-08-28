import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react"; // Using lucide-react for the hamburger icon!

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Smooth scrolling function for your anchor links
    const handleScroll = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false); // Close mobile menu if open
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        // Added backdrop-blur-md for a modern "glassy" navbar effect
        <header className="shadow-sm fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold font-serif sm:text-4xl text-blue-600">SHV</h1>
                </div>
                
                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-8 items-center">
                    {['home', 'products', 'about'].map((item) => (
                        <li key={item}>
                            <a 
                                href={`#${item}`} 
                                onClick={(e) => handleScroll(e, item)}
                                className="text-lg font-medium text-gray-700 hover:text-blue-600 capitalize transition-colors duration-300 relative group"
                            >
                                {item}
                                {/* Animated underline effect */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex gap-4">
                    <Link to="/login">
                        <button className="cursor-pointer px-5 py-2 font-bold text-sm border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-300 active:scale-95">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="cursor-pointer px-5 py-2 font-bold text-sm bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 active:scale-95">
                            Sign up
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button 
                    className="md:hidden text-gray-700" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
                    {['home', 'products', 'about'].map((item) => (
                        <a 
                            key={item}
                            href={`#${item}`} 
                            onClick={(e) => handleScroll(e, item)}
                            className="text-lg font-medium capitalize text-gray-800 hover:text-blue-600"
                        >
                            {item}
                        </a>
                    ))}
                    <div className="flex flex-col gap-2 mt-2">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                            <button className="cursor-pointer w-full py-2 border-2 border-blue-500 text-blue-500 font-bold rounded-lg">Login</button>
                        </Link>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                            <button className="cursor-pointer w-full py-2 bg-blue-500 text-white font-bold rounded-lg">Sign up</button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}