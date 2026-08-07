const express=require('express')
const cors=require('cors')
const authRouter=require('./routes/authrouter.js')
const globalMiddleware=require("./middlewares/globalMiddleware.js")

const app=express()

app.use(express.json())
app.use(cors())

app.use("/api/v1",authRouter)

app.use(globalMiddleware)

module.exports=app