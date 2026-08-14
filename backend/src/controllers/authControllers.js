const { error } = require('node:console')
const pool = require('../config/db.js')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const mailer=require('../config/nodemailer.js')
const { ref } = require('node:process')

const login=async (req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password) 
        return next({"status":400,"msg":"email and password required"})
    try{
        const result=await pool.query("select * from users where email=$1",[email]);
        if(result.rows.length==0)
            return next({"status":404,"msg":"no account registered with this email"})
        const isMatched=await bcrypt.compare(password,result.rows[0].password)
        if(!isMatched)
            return next({"status":401,"msg":"incorrect password"})
        const user={
            "user_id":result.rows[0].user_id,
            "role":result.rows[0].role
        }
        const accessToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"1h"})
        const refreshToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"10days"})
        res.status(200).json({"status":200,
            "msg":"login success",
            "userType":user.role,
            "accessToken":accessToken,
            "refreshToken":refreshToken})   
    }
    catch(error){
        next(error)
    }
}

const register=async (req,res,next)=>{
    const {name,email,password}=req.body
    if(!email || !password || !name)
        return next({"status":400,"msg":"all credidentals are required!"})
    try{
        const check=await pool.query("select user_id from users where email=$1",[email])
        if(check.rows.length>0)
            return next({"status":400,"msg":"email already registered!"})
        const otp=Math.floor(100000+Math.random()*900000).toString()
        const user={
            name,
            email,
            password,
            otp
        }
        const otpToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'5m'})
        mailer.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"your OTP for register",
            text:`DO NOT SHARE WITH ANYONE \n HERE IS YOU OTP FRO REGISTER :${otp}\n NOTE: EXPIRES IN 5 MINUTES`
        })
        res.status(200).json({"status":200,"msg":"otp send success","otpToken":otpToken})
    }
    catch(error){
        next(error)
    }
}

const verifyRegistration=async (req,res,next)=>{
    const token=req.headers.authorization;
    const {otp}=req.body
    if(!token || !token.startsWith("Bearer"))
        return next({"status":400,"msg":"token required!"})

    if(!otp)
        return next({"status":400,"msg":"otp required!"})

    const otpToken=token.split(" ")[1]
    try{
        const data=jwt.verify(otpToken,process.env.JWT_SECRET)
        if(data.otp!=otp)
            return next({"status":401,"msg":"otp verification failed"})
        const hashed_pass=await bcrypt.hash(data.password,10)
        const result=await pool.query("insert into users (name,email,password) values($1,$2,$3) returning user_id ,role",
            [data.name,data.email,hashed_pass]
        )
        const user={
            user_id:result.rows[0].user_id,
            role:result.rows[0].role
        }
        const accessToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"1h"})
        const refreshToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"10days"})
        res.status(201).json({
            "status":201,
            "msg":"registered successfully",
            "accessToken":accessToken,
            "refreshToken":refreshToken
        })
    }
    catch(error){
        next({"status":"401","msg":"otp exipred!"})
    }
}

const getAccesstoken=(req,res,next)=>{
    const {refreshToken}=req.body
    if(!refreshToken)
        next({"status":400,"msg":"refresh token required!"})
    try{
        const data=jwt.verify(refreshToken,process.env.JWT_SECRET)
        const user={
            user_id:data.user_id,
            role:data.role
        }
        const accessToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({"status":200,"msg":"token generated","accessToken":accessToken})
    }
    catch(error){
        next({"status":401,"msg":"Authentication failed"})
    }
}

module.exports={login,register,verifyRegistration,getAccesstoken}