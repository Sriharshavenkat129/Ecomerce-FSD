import {Link} from "react-router"

export default function Header() {
    return (
        <header>
            <div>
                <h1>SHV</h1>
            </div>
            <div>
                <ul>
                    <a href="#home"><li>Home</li></a>
                    <a href="#products"><li>Products</li></a>
                    <a href="#about"><li>About</li></a>
                </ul>
            </div>
            <div>
                <Link style={{textDecoration:"none"}}
                to="/login"
                >
                <button>Login</button>
                </Link>
                <Link style={{textDecoration:"none"}}
                to="/register"
                >
                <button>Start for free</button>
                </Link>
            </div>
        </header>
    )
}