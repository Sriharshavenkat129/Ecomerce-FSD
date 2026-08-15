const {z} =require('zod')

const registerSchema=z.object({
    name:z.string("name cannot be empty").trim().min(5,"name is too short"),
    email:z.string("email is required").email("enter a valid email address"),
    password:z.string("password is required")
    .min(8,"password is too short")
    .regex(/[a-z]/,"password must contain atleast one small letter")
    .regex(/[A-Z]/,"password must contain atleast one capital letter")
    .regex(/[0-9]/,"pssword must contain a digit")
})

const loginSchema=z.object({
    email:z.string().email("enter a valid email address"),
    password:z.string("password is required!")
})

const passwordSchema=z.object({
    old_password:z.string("password is required"),
    new_password:z.string("new password cannot be empty")
    .min(8,"password is too short")
    .regex(/[a-z]/,"password must contains one small letter")
    .regex(/[A-Z]/,"password must contain one capital letter")
    .regex(/[0-9]/,"password must contain a digit")
})

const addressSchema=z.object({
    location:z.string("loaction is required!")
    .min(10,"location details are too short"),
    pincode:z.string("pincode required")
    .min(6,"enter a valid pincode")
    .max(6,"enter a valid pincode"),
    state:z.string("state required")
    .min(3,"enter proper state name")
})

module.exports={registerSchema,loginSchema,passwordSchema,addressSchema}