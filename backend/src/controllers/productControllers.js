const { image } = require('framer-motion/client')
const uploadToCloudinary = require('../config/cloudinary')
const pool=require('../config/db')
const { fi } = require('zod/v4/locales')
const { stat } = require('node:fs')

const getAllProducts=async (req,res,next)=>{
    try{
        const result=await pool.query("select * from products")
        if(result.rows.length==0){
            return next({"status":404,"msg":"no products at this time"})
        }
        const products=result.rows
        res.status(200).json({msg:"products fetched succesfully",data:products})
    }
    catch(error){
        next(error)
    }
}

const getProductById=async (req,res,next)=>{
    const product_id=req.params.product_id
    try{
        const result=await pool.query("select * from products where product_id=$1",[product_id])
        if(result.rows.length==0)
            return next({"status":404,"msg":"product not found"})
        res.status(200).json({"msg":"product fetched success","data":result.rows[0]})
    }
    catch(error){
        console.log(error)
        next({"status":500,"msg":"failed to fetch data"})
    }
}

const getProductByCategory=async (req,res,next)=>{
    const category=req.params.category
    try{
        const result=await pool.query("select * from products where category=$1",[category])
        if(result.rows.length==0)
            return next({"status":404,"msg":"currently no products of this category"})
        res.status(200).json({"msg":"product fetched success","data":result.rows})
    }
    catch(error){
        next({"status":500,"msg":"failed to fetch data"})
    }
}

const getProductsByQuery=async (req,res,next)=>{
    const query=req.query
    let queries=[]
    let values=[]
    let count=1
    if(query.product_name){
        queries.push(`(product_name ilike $${count} or product_description ilike $${count})`)
        values.push(`%${query.product_name}%`)
        count++;
    }
    if(query.minPrice){
        queries.push(`price>=$${count}`)
        values.push(query.minPrice)
        count++;
    }
    if(query.maxPrice){
        queries.push(`price<=$${count}`)
        values.push(query.maxPrice)
        count++;
    }
    try{
        const queryString=queries.length>1?queries.join(" and "):(queries.length==1)?queries[0]:"product_id is not null"
        const result=await pool.query(`select * from products where ${queryString}`,values)
        if(result.rows.length==0)return next({"status":404,"msg":"cannot find any products matching your criteria"})
        res.status(200).json({"msg":"products fecthed successfully","data":result.rows})
    }
    catch(error){
        console.log(error)
        next(error)
    }
}   

//admin related controllers

const addProduct=async (req,res,next)=>{
    const {product_name,product_description,price,stock,category}=req.body
    if(!product_name || !product_description || !price || !stock || !category)
        return next({"status":400,"msg":"please enter all details!"})
    const file=req.file.buffer
    if(!file)return next({"status":400,"msg":"product image required!"})
    try{
    const imageUrl=await uploadToCloudinary(file)
    const result=await pool.query("insert into products (product_name,product_description,product_image,price,stock,category) \
        values($1,$2,$3,$4,$5,$6) returning *",[product_name,product_description,imageUrl,price,stock,category])
    res.status(201).json({'msg':"product added succesfully","data":result.rows[0]})
    }
    catch(error){
        next({"status":500,"msg":error.message})
    }
}

const updateProduct=async (req,res,next)=>{
    const data=req.body
    let values=[]
    let queries=[]
    let count=1
    let imageUrl;
    if(req.file.buffer){
        imageUrl=await uploadToCloudinary(req.file.buffer)
        values.push(imageUrl)
        queries.push(`imageUrl=${count++}`)
    }
    const allowedFields=['product_name','product_description','price','stock','category','is_available']
    for(const field of allowedFields){
        if(data[field]!=undefined){
            values.push(data[field])
            queries.push(`${field}=$${count}`)
            count++;
        }
    }
    if(values.length==0) return next({"status":200,"msg":"nothing to update!"})
    const product_id=data.product_id
    values.push(product_id)
    try{
        const query=queries.join(", ")
        const result=await pool.query(`update products set ${query} where product_id=$${count} returning *`,values)
        if(result.rows.length==0)return next({"status":404,"msg":"product doesn`t exist"})
        res.status(200).json({"status":200,"msg":"product updated successfully","data":result.rows[0]})
    }
    catch(error){
        next({"status":500,"msg":"updation failed"})
    }
}

const deleteProduct=async (req,res,next)=>{
    const product_id=req.params.product_id
    try{
        const result=await pool.query("update products set is_available=$1 where product_id=$2",[false,product_id])
        res.status(200).json({"msg":"product removed from the store"})
    }
    catch(error){
        next({"status":500,"msg":"product updation failed"})
    }
}


module.exports={getAllProducts,getProductById,getProductByCategory,getProductsByQuery,addProduct,updateProduct,deleteProduct}