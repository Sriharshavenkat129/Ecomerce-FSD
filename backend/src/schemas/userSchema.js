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

module.exports={registerSchema,loginSchema}