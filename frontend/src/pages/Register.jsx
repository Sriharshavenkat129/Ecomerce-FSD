import { Link, useNavigate } from "react-router"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import app from "../utils/app"
import RateLimit from "../components/RateLimit"

export default function Register() {
    const [data, setData] = useState({
        "name": "",
        "email": "",
        "password": ""
    })
    const navigate = useNavigate()
    const [otpSent, setOtpSent] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [otp, setOtp] = useState("")
    const [loading,setLoading]=useState(false)
    const [isRateLimited,setRateLimited]=useState(false)
    const [otpTimer, setOtpTimer] = useState(0);

    const hasDigit = /[0-9]/.test(data.password)
    const hasCap = /[A-Z]/.test(data.password)
    const hasSmall = /[a-z]/.test(data.password)
    const isValidPassword = hasCap && hasDigit && hasSmall

    useEffect(() => {
        if (otpTimer > 0) {
            const time = setTimeout(() => {
                setOtpTimer(pre => pre - 1)
            }, 1000)
            return () => clearTimeout(time)
        }
    }, [otpTimer])

    const handleSubmit = async (e) => {
        if (e)
            e.preventDefault()
        if (data.password.length < 8 || isValidPassword == false) {
            toast.error("password doesn`t met the requirements!")
            return;
        }
        setLoading(true)
        try {
            const result = await app.post("/register", data)
            localStorage.setItem('otpToken', result.data.otpToken)
            toast.success(result.data.msg)
            setOtpSent(true)
            setOtpTimer(60)
            setRateLimited(false)
        }
        catch (error) {
            let msg;
            if(error.response.status==429){
                msg=`${error.response.data}`
                setRateLimited(true)
            }
            toast.error(msg || error.response.data.msg)
        }
        finally{
            setLoading(false)
        }
    }

    const handleOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('otpToken')
            const result = await app.post("/verify",
                { "otp": otp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            localStorage.removeItem('otpToken')
            localStorage.setItem('accessToken', result.data.accessToken)
            localStorage.setItem('refreshToken', result.data.refreshToken)
            toast.success(result.data.msg)
            navigate("/Home")

        }
        catch (error) {
            let msg;
            if(error.response.status==429){
                msg=`${error.response.data}`
                setRateLimited(true)
            }
            toast.error(msg || error.response.data.msg)
        }
        finally{
            setLoading(false)
        }
    }

    const resendOTP = () => {
        handleSubmit()
    }

    return (
        <div className="h-svh flex items-center justify-center">
            {(!otpSent && !isRateLimited) &&
                <div className="rounded-xl p-6 flex flex-col justify-center items-center bg-gray-50 shadow-xl">
                    <div className="mb-6 mr-auto font-bold text-2xl font-serif">
                        <h3>Register here</h3>
                    </div>
                    <form onSubmit={handleSubmit}
                    className="flex flex-col gap-4">
                        <label className="flex gap-1 text-md font-semibold flex-col">
                            Name:
                            <input type="text" minLength={5} placeholder="username"
                                value={data.name} onChange={(e) => { setData(pre => ({ ...pre, name: e.target.value })) }} 
                                className="outline-none border-2 w-xs rounded-md p-1 text-balance"/>
                        </label>
                        <label className="flex flex-col text-md font-semibold gap-1">
                            Email:
                            <input type="email" placeholder="e.g example@gmail.com"
                                value={data.email} onChange={(e) => { setData(pre => ({ ...pre, email: e.target.value })) }} 
                                className="outline-none border-2 w-xs rounded-md p-1 text-balance"/>
                        </label>
                        <label className="font-semibold text-md flex flex-col gap-1">
                            Password:
                            <div className="flex gap-1 w-xs border-2 rounded-md p-1">
                            <input type={showPass ? "text" : "password"} placeholder="A*a*9*"
                                value={data.password} onChange={(e) => { setData(pre => ({ ...pre, password: e.target.value })) }} 
                                className="outline-none text-balance w-9/10"/>
                            <span onClick={() => setShowPass(pre => !pre)}
                                className="w-1/10">{showPass ? <Eye /> : <EyeOff />}</span>
                            </div>
                            {
                                (data.password.length > 0) &&
                                <p className={`${isValidPassword?"text-green-500":"text-red-500"} -mb-2`}>{isValidPassword?"strong password":"password is not acceptable!"}</p>
                            }
                        </label>
                        <div className="ml-auto">
                            <button type="submit" disabled={!isValidPassword || data.email.length<5 || data.name.length<1 || loading}
                            className="bg-blue-500 text-white text-md font-semibold cursor-pointer w-24 px-2 py-1 rounded-md
                            transition-all ease-in-out duration-300 hover:bg-blue-600 active:scale-95
                            disabled:bg-blue-200">{loading?"processing...":"Register"}</button>
                        </div>
                    </form>
                    <div className="mt-4">
                        <p className="text-md">already have an account? <Link to="/login" className="underline font-semibold">login here</Link></p>
                    </div>
                </div>
            }
            {(otpSent && !isRateLimited) &&
                <div className="bg-gray-50 flex flex-col gap-2 rounded-md p-4 text-md w-xs">
                    <div>
                        <p>OTP sent to the following email</p>
                        <p className="font-semibold -mt-1">{data.email}</p>
                    </div>
                    <div>
                        <form onSubmit={handleOTP}
                        className="flex flex-col items-center m-auto gap-4">
                            <label className="flex flex-col mr-auto gap-1 font-semibold">
                                Enter OTP:
                                <input type="text" minLength={6} maxLength={6} 
                                    value={otp} onChange={(e) => { setOtp(e.target.value) }} 
                                    className="p-0.5 px-1 outline-none border-2 rounded-md"/>
                            </label>
                            <button type="submit" disabled={otp.length!=6 || loading}
                            className="bg-orange-400 px-4 py-1 font-semibold text-md rounded-md cursor-pointer
                            hover:bg-orange-500 active:scale-95 transition-all ease-in-out duration-300
                            disabled:bg-orange-200">{loading?"Processing...":"Verify"}</button>
                        </form>
                        <div>
                            <p className="mt-4 text-md">{otpTimer !=0? `you can send otp in ${otpTimer}sec`:
                                    <span onClick={() => { resendOTP() }} className="underline cursor-pointer hover:font-bold">resend</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            }
            {
                isRateLimited &&
                <RateLimit time={15}/>
            }
        </div>
    )
}