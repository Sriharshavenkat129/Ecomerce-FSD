const { rejects } = require('node:assert')
const { resolve } = require('node:dns')

const cloudinary=require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_SECRET
})

const uploadToCloudinary=(fileBuffer)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream(
            {
                folder:"ecommerce_product_images",
                resource_type:"image"
            },
            (error,result)=>{
                if(error)return reject(error)
                resolve(result.secure_url)
            }
        )
        uploadStream.end(fileBuffer)
    })
}

module.exports=uploadToCloudinary