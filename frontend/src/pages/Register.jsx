import { Link, useNavigate } from "react-router"
import { toast } from "react-hot-toast"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import app from "../utils/app"

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
        console.log(data)
        if (data.password.length < 8 || isValidPassword == false) {
            toast.error("password doesn`t met the requirements!")
            return;
        }
        try {
            const result = await app.post("/register", data)
            localStorage.setItem('otpToken', result.data.otpToken)
            toast.success(result.data.msg)
            setOtpSent(true)
            setOtpTimer(60)
        }
        catch (error) {
            if (error.response.status == 500) navigate('/ServerError')
            toast.error(error.response.data.msg)
        }
    }

    const handleOTP = async (e) => {
        e.preventDefault()
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
            if (error.response.status == 500) navigate("/ServerError")
            toast.error(error.response.data.msg)
        }
    }

    const resendOTP = () => {
        handleSubmit()
    }

    return (
        <div>
            {!otpSent &&
                <div>
                    <div>
                        <h3>Register here</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input type="text" required minLength={5} placeholder="username"
                                value={data.name} onChange={(e) => { setData(pre => ({ ...pre, name: e.target.value })) }} />
                        </label>
                        <label>
                            Email:
                            <input type="email" required placeholder="e.g example@gmail.com"
                                value={data.email} onChange={(e) => { setData(pre => ({ ...pre, email: e.target.value })) }} />
                        </label>
                        <label>
                            Password:
                            <input type={showPass ? "text" : "password"} required placeholder="A*a*9*"
                                value={data.password} onChange={(e) => { setData(pre => ({ ...pre, password: e.target.value })) }} />
                            <span onClick={() => setShowPass(pre => !pre)}>{showPass ? <Eye /> : <EyeOff />}</span>
                            {
                                (!isValidPassword && data.password.length > 0) &&
                                <p>weak password! mix capital , small letters and digits</p>
                            }
                        </label>
                        <div>
                            <button type="submit">Register</button>
                        </div>
                    </form>
                    <div>
                        <p>already have an account?<Link to="/login">login here</Link></p>
                    </div>
                </div>
            }
            {otpSent &&
                <div>
                    <div>
                        <p>OTP sent to</p>
                        <p>{data.email}</p>
                    </div>
                    <div>
                        <form onSubmit={handleOTP}>
                            <label>
                                Enter OTP:
                                <input type="text" minLength={6} maxLength={6} required
                                    value={otp} onChange={(e) => { setOtp(e.target.value) }} />
                            </label>
                            <button type="submit">Verify</button>
                        </form>
                        <div>
                            <p>{otpTimer == 0 ? "resend otp" : `you can send otp in ${otpTimer}sec`}
                                {otpTimer == 0 &&
                                    <span onClick={() => { resendOTP() }}>resend</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}