import { ArrowLeft, EyeIcon, EyeOff, Lock, User } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import app from "../utils/app"
import toast from "react-hot-toast"
import RateLimit from "../components/RateLimit"

export default function Login({setUserType }) {
    const [data, setData] = useState({
        "email": "",
        "password": ""
    })

    const [resetData, setResetData] = useState({
        "email": "",
        "new_password": "",
        "otp": ""
    })

    const [forgetPassword, setForgetPassword] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [OtpVerified, setOtpVerified] = useState(false)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [isRateLimited, setRateLimited] = useState(false)

    const hasDigit = /[0-9]/.test(resetData.new_password)
    const hasCap = /[A-Z]/.test(resetData.new_password)
    const hasSmall = /[a-z]/.test(resetData.new_password)
    const isValidPassword = hasCap && hasDigit && hasSmall

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            return toast.error("email  and password required")
        }
        try {
            setLoading(true)
            const result = await app.post("/login", data)
            localStorage.setItem('accessToken', result.data.accessToken)
            localStorage.setItem('refreshToken', result.data.refreshToken)
            setUserType(result.data.userType)
            toast.success(result.data.msg)
            if(result.data.userType=="user")navigate("/Home")
            else if(result.data.userType=="admin")navigate("/admin")
        }
        catch (error) {
            if (error.response?.status == 429) {
                setRateLimited(true)
                toast.error(error.response?.data)
            }
            else
                toast.error(error.response?.data.msg || "something went wrong")
        }
        finally {
            setLoading(false)
        }
    }

    const handleForgetPassword = async () => {
        try {
            setLoading(true)
            let response;
            if (!otpSent) {
                if (!resetData.email) {
                    return toast.error("enter a valid eamil",)
                }
                response = await app.post("/resetpassword",resetData)
                localStorage.setItem("otpToken", response.data['otpToken'])
                setOtpSent(true)
            }
            if (otpSent && !OtpVerified) {
                if (!resetData.otp || resetData.otp.length != 6)
                    return toast.error("enter a valid otp")
                response = await app.post("/verifyresetotp", { ...resetData, "otpToken": localStorage.getItem('otpToken') })
                toast.success(response.data.msg)
                setOtpVerified(true)
            }
            if (OtpVerified) {
                if(!isValidPassword){
                    return toast.error("password doesn`t met the requirements")
                }
                response= await app.patch("/resetpassword",{...resetData,"otpToken":localStorage.getItem('otpToken')})
                localStorage.removeItem('otpToken')
                toast.success(response.data.msg)
                setForgetPassword(false)
            }
        }
        catch (error) {
            if (error.response?.status == 429) {
                setRateLimited(true)
                return toast.error("too may requests!")
            }
            toast.error(error.response?.data.msg || "something went wrong!")
        }
        finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (<div className="h-screen flex justify-center items-center">
            <div className="animate-spin size-10 border-4 border-t-gray-200 rounded-full border-blue-400"></div>
        </div>)
    }

    return (
        <div className="h-screen flex items-center justify-center">
            {(isRateLimited == false && !forgetPassword) &&
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
                            <div className="ml-auto"><p className="font-semibold underline cursor-pointer" onClick={() => setForgetPassword(true)}>forget password</p></div>
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
                <RateLimit time={15} />
            }
            {
                (!isRateLimited && forgetPassword) &&
                <div className="h-screen flex justufy-center items-center">
                    <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-4 shadow-2xl">
                        <div className="flex py-1 justify-start"><ArrowLeft size={40} className="cursor-pointer" onClick={() => setForgetPassword(false)} /></div>
                        <p className="font-bold font-serif text-lg">Reset Password:</p>

                        <label className="flex gap-1 border-2 rounded-md items-center h-8 py-4 px-2 bg-white">
                            <User size={25} />
                            <input type="email" placeholder="user email"
                                value={resetData.email} onChange={(e) => { setResetData(pre => ({ ...pre, email: e.target.value })) }}
                                className="outline-none text-md w-xs text-black font-semibold text-balance" 
                                disabled={otpSent}/>
                        </label>
                        {(otpSent && !OtpVerified) &&
                            <>
                                <label className="flex flex-col mr-auto gap-1 font-semibold">
                                    Enter OTP:
                                    <input type="text" minLength={6} maxLength={6}
                                        value={resetData.otp} onChange={(e) => { setResetData(pre=>({...pre,"otp":e.target.value}))}}
                                        className="p-0.5 px-1 outline-none border-2 rounded-md" />
                                </label>
                            </>
                        }
                        {OtpVerified &&
                            <label className="flex gap-1 border-2 rounded-md items-center h-8 py-4 px-2 bg-white">
                                <Lock size={25} />
                                <input type={showPass ? "text" : "password"} placeholder="new password"
                                    value={resetData.new_password} onChange={(e) => { setResetData(pre => ({ ...pre, new_password: e.target.value })) }}
                                    className="outline-none w-xs font-semibold text-md text-black text-balance" />
                                <span onClick={() => setShowPass(pre => !pre)}>{!showPass ? <EyeOff size={20} /> : <EyeIcon size={20} />}</span>
                            </label>
                        }
                        {
                            (OtpVerified && resetData.new_password.length > 0) &&
                            <p className={`${isValidPassword ? "text-green-500" : "text-red-500"} -mb-2`}>{isValidPassword ? "strong password" : "password is not acceptable!"}</p>
                        }
                        <div className="flex p-2 justify-end"><button className="bg-blue-400 rounded-md px-4 py-1 text-md font-semibold
                        cursor-pointer hover:bg-blue-500 transition-all duration-300 ease-in-out active:bg-blue-400 active:scale-98"
                            onClick={() => handleForgetPassword()}>{OtpVerified?"Reset password":otpSent?"send OTp":"send OTP"}</button></div>
                    </div>
                </div>
            }
        </div>
    )
}