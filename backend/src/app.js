const express=require('express')
const cors=require('cors')
const authRouter=require('./routes/authrouter.js')
const globalMiddleware=require("./middlewares/globalMiddleware.js")
const userRouter=require("./routes/userRoutes.js")
const adminRouter=require("./routes/adminRouter.js")
const {userAuth,adminAuth}=require("./middlewares/authMiddlewares.js")
const {generalLimiter}=require("./middlewares/rateLimiters.js")

const app=express()
app.set('trust proxy', 1);

app.use(express.json())
app.use(cors())
app.use(generalLimiter)

app.use("/api/v1",authRouter)
app.use("/api/v1/user",userAuth,userRouter)
app.use("/api/v1/admin",userAuth,adminAuth,adminRouter)

app.use(globalMiddleware)

module.exports=app