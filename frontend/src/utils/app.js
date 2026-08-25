import axios from "axios"

const app=axios.create({
    baseURL:import.meta.env.VITE_API_URL
})

app.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem('accessToken')
        if(accessToken && !config.headers.Authorization)
            config.headers.Authorization=`Bearer ${accessToken}`
        return config
    }
)

app.interceptors.response.use(
    (response)=>{
        return response
    },
    async (error)=>{
        const originalRequest=error.config
        if(error.response && error.response.status==401 && !originalRequest._retry && originalRequest.headers.Authorization){
            originalRequest._retry=true
            const refreshToken=localStorage.getItem('refreshToken')
            if(refreshToken){
                try{
                    const result=await app.post("/refresh",{refreshToken})
                    localStorage.setItem('accessToken',result.data.accessToken)
                    originalRequest.headers.Authorization=`Bearer ${result.data.accessToken}`
                    return app(originalRequest)
                }catch(error){
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    window.location.href="/login"
                }
            }
        }
        return Promise.reject(error)
    }
)

export default app