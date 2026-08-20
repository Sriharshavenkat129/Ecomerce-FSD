import {Link} from "react-router"

export default function Header() {
    return (
        <header className="shadow-md shadow-olive-200 fixwed top-0 left-0 right-0 flex items-center gap-2 flex-row bg-white justify-between px-2 py-3
        sm:px-4">
            <div>
                <h1 className="text-2xl font-bold font-serif sm:text-4xl">SHV</h1>
            </div>
            <div>
                <ul className="flex gap-6">
                    <a href="#home" className="text-xl hover:font-semibold transition-all hover:-translate-y-0.5 ease-in-out duration-300"><li>Home</li></a>
                    <a href="#products" className="text-xl hover:font-semibold transition-all hover:-translate-y-0.5 ease-in-out duration-300"><li>Products</li></a>
                    <a href="#about" className="text-xl hover:font-semibold hover:-translate-y-0.5 transition-all ease-in-out duration-300"><li>About</li></a>
                </ul>
            </div>
            <div className="flex gap-2">
                <Link style={{textDecoration:"none"}}
                to="/login"
                >
                <button className="border-blue-400 border-4 rounded-md px-4 py-0.5 font-bold text-sm
                transition-all ease-in-out duration-300
                hover:bg-blue-400 hover:text-white cursor-pointer shrink-0
                sm:text-md">Login</button>
                </Link>
                <Link style={{textDecoration:"none"}}
                to="/register"
                >
                <button className="border-4 border-blue-400 rounded-md px-4 py-0.5 text-sm bg-blue-400 text-white font-bold cursor-pointer
                transition-all ease-in-out duration-300
                hover:bg-white hover:text-black shrink-0 text-nowrap
                sm:text-md">Sign up</button>
                </Link>
            </div>
        </header>
    )
}