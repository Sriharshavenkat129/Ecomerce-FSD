import {Link} from "react-router"

export default function Main() {
    return (
        <main>
            <div>
                <div id="home">
                    <div>
                        <h1>Home</h1>
                    </div>
                    <div>
                        <Link style={{ textDecoration: "none" }}
                            to="/login"
                        >
                            <button>Login</button>
                        </Link>
                        <Link style={{ textDecoration: "none" }}
                            to="/register"
                        >
                            <button>Start for free</button>
                        </Link>
                    </div>
                </div>
                <div id="products">
                    <h1>products</h1>
                </div>
            </div>
        </main>
    )
}