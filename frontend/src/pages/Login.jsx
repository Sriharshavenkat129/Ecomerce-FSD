import { EyeIcon, EyeOff, Lock, User } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import app from "../utils/app"
import toast from "react-hot-toast"
import RateLimit from "../components/RateLimit"

export default function Login({ setUserType }) {
    const [data, setData] = useState({
        "email": "",
        "password": ""
    })
    const navigate = useNavigate()
    const [loading ,setLoading]=useState(false)
    const [showPass, setShowPass] = useState(false)
    const [isRateLimited,setRateLimited]=useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!data.email || !data.password){
            return toast.error("email  and password required")
        }
        try {
            setLoading(true)
            const result = await app.post("/login", data)
            localStorage.setItem('accessToken', result.data.accessToken)
            localStorage.setItem('refreshToken', result.data.refreshToken)
            setUserType(result.data.userType)
            toast.success(result.data.msg)
            navigate("/Home")
        }
        catch (error) {
            if (error.response.status==429){
                setRateLimited(true)
                toast.error('Slow down!')
            }
            else
            toast.error(error.response?.data.msg || "something went wrong")
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className="h-svh flex items-center justify-center">
            {isRateLimited==false &&
            <div className="rounded-xl p-6 flex flex-col justify-center items-center bg-gray-50 shadow-xl">
                <div className="mr-auto pl-4 mb-2">
                    <h1 className="text-2xl font-bold font-serif mb-4">Login here</h1>
                </div>
                <div>
                    <form onSubmit={handleSubmit}
                        className="flex flex-col gap-4">
                        <label className="flex gap-1 border-2 rounded-md items-center h-8 py-4 px-2 bg-white">
                            <User size={25} />
                            <input type="email" placeholder="user email"
                                value={data.email} onChange={(e) => { setData(pre => ({ ...pre, email: e.target.value })) }}
                                className="outline-none text-md w-xs text-black font-semibold text-balance" />
                        </label>
                        <label className="flex gap-1 border-2 rounded-md items-center h-8 py-4 px-2 bg-white">
                            <Lock size={25} />
                            <input type={showPass ? "text" : "password"} placeholder="password"
                                value={data.password} onChange={(e) => { setData(pre => ({ ...pre, password: e.target.value })) }}
                                className="outline-none w-xs font-semibold text-md text-black text-balance" />
                            <span onClick={() => setShowPass(pre => !pre)}>{!showPass ? <EyeOff size={20} /> : <EyeIcon size={20} />}</span>
                        </label>
                        <div className="ml-auto mb-4">
                            <button type="submit" disabled={loading}
                                className="text-md text-white font-semibold bg-blue-500 p-1 w-24 rounded-md
                                transition-all duration-300 ease-in-out cursor-pointer shadow-sm hover:shadow-blue-600
                                hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 active:bg-blue-500
                                disabled:bg-blue-200">
                                login</button>
                        </div>
                    </form>
                    <div>
                        <p className="text-md font-semibold">don`t have an account? <Link to="/register" className="font-bold underline">sign up</Link></p>
                    </div>
                </div>
            </div>
            }
            {
                isRateLimited &&
                <RateLimit/>
            }
        </div>
    )
}