const {login,register,verifyRegistration,getAccesstoken}=require("../controllers/authControllers.js")
const {sendPassWordResetOtp,verifyPassWordResetOtp,resetPassword}=require("../controllers/authControllers.js")
const {registerSchema,loginSchema}=require('../schemas/userSchema.js')
const {passwordValidator,emailValidator}=require("../schemas/userSchema.js")
const validate=require("../middlewares/validationMiddleware.js")
const {authLimiter}=require("../middlewares/rateLimiters.js")

const router=require('express').Router()

router.post("/login",validate(loginSchema),authLimiter,login)

router.post("/register",validate(registerSchema),authLimiter,register)

router.post("/verify",authLimiter,verifyRegistration)

router.post("/refresh",getAccesstoken)

router.post("/resetpassword",validate(emailValidator),authLimiter,sendPassWordResetOtp)

router.post("/verifyresetotp",authLimiter,verifyPassWordResetOtp)

router.patch("/resetpassword",validate(passwordValidator),authLimiter,resetPassword)

module.exports=router