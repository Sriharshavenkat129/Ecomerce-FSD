const pool=require('../config/db')
const bcrypt =require("bcryptjs")

const getUserDetails=async (req,res,next)=>{
    try{
        const result=await pool.query("select name,email from users where user_id=$1",[req.user.user_id])
        if(result.rows.length==0)
            return next({"status":404,"msg":'user not found'})
        res.status(200).json({"msg":"user data fetched","data":result.rows[0]})
    }
    catch(error){
        next({"status":500,"msg":"unable to fetch user details"})
    }
}

const updateUserPassWord=async (req,res,next)=>{
    const {old_password,new_password}=req.body
    try{
        const result=await pool.query("select password from users where user_id=$1 for update",[req.user.user_id])
        const isMatch=await bcrypt.compare(old_password,result.rows[0].password)
        if(!isMatch)
            return next({"status":401,"msg":"incorrect password"})
        const newHashedPassword=await bcrypt.hash(new_password,10)
        await pool.query("update users set password=$1 where user_id=$2",[newHashedPassword,req.user.user_id])
        res.status(200).json({"msg":"password updated successfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({"msg":"password updation failed!"})
    }
}

const addAddress=async (req,res,next)=>{
    const {location,pincode,state}=req.body
    try{
        const result=await pool.query("insert into addresses (location,pincode,state,user_id) values($1,$2,$3,$4)"
            ,[location,pincode,state,req.user.user_id])
        res.status(200).json({"msg":"address added successfullt","data":result.rows[0]})
    }
    catch(error){
        console.log(error)
        next({"msg":"adding address failed","status":500})
    }
}

module.exports={getUserDetails,updateUserPassWord,addAddress}