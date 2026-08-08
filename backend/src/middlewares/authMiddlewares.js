const jwt=require("jsonwebtoken")
require('dotenv').config()

const userAuth=(req,res,next)=>{
    const header=req.headers.authorization;
    if(!header || !header.startsWith('Bearer'))
        next({"status":400,"msg":"token required!"})
    try{
        const refreshToken=header.split(" ")[1]
        const data=jwt.verify(refreshToken,process.env.JWT_SECRET)
        req.user=data;
        next()
    }
    catch(error){
        next({"status":401,"msg":"Authentication failed"})
    }
}

const adminAuth=(req,res,next)=>{
    if(!req.user.role)
        next({"status":401,"msg":"Authentication failed"})
    if(req.user.role=='admin')next()
    else next({"status":403,"msg":"Unauthorized action!"})
}