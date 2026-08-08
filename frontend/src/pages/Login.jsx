import {EyeIcon, EyeOff, Lock,User} from "lucide-react"
import {Link, useNavigate} from "react-router"
import {useState} from "react"
import app from "../utils/app"
import toast from "react-hot-toast"

export default function Login({setUserType}) {
    const [data,setData]=useState({
        "email":"",
        "password":""
    })
    const navigate=useNavigate()
    const [showPass,setShowPass]=useState(false)
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            console.log(data)
            const result=await app.post("/login",data)
            localStorage.setItem('accessToken',result.data.accessToken)
            localStorage.setItem('refreshToken',result.data.refreshToken)
            setUserType(result.data.userType)
            toast.success(result.data.msg)
            navigate("/Home")
        }
        catch(error){
            if(error.response.status==500)navigate('/ServerError')
            toast.error(error.response?.data.msg||"something went wrong")
        }
    }
    return (
        <div>
            <div>
                <div>
                    <h1>Login here</h1>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <User/>
                            <input type="email" required={true} placeholder="user email"
                            value={data.email} onChange={(e)=>{setData(pre=>({...pre,email:e.target.value}))}}/>
                        </label>
                        <label>
                            <Lock/>
                            <input type={showPass?"text":"password"} required placeholder="user password"
                            value={data.password} onChange={(e)=>{setData(pre=>({...pre,password:e.target.value}))}}/>
                            <span onClick={()=>setShowPass(pre=>!pre)}>{!showPass?<EyeOff/>:<EyeIcon/>}</span>
                        </label>
                        <div>
                            <button type="submit">login</button>
                        </div>
                    </form>
                    <div>
                        <p>don`t have an account?<Link to="/register">sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}