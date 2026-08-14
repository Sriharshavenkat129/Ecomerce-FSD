const express=require('express')
const cors=require('cors')
const authRouter=require('./routes/authrouter.js')
const globalMiddleware=require("./middlewares/globalMiddleware.js")
const userRouter=require("./routes/userRoutes.js")
const adminRouter=require("./routes/adminRouter.js")

const app=express()

app.use(express.json())
app.use(cors())

app.use("/api/v1",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)

app.use(globalMiddleware)

module.exports=app