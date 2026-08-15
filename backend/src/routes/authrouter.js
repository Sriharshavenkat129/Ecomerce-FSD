const {login,register,verifyRegistration,getAccesstoken}=require("../controllers/authControllers.js")
const {sendPassWordResetOtp,verifyPassWordResetOtp,resetPassword}=require("../controllers/authControllers.js")
const {registerSchema,loginSchema}=require('../schemas/userSchema.js')
const {passwordValidator,emailValidator}=require("../schemas/userSchema.js")
const validate=require("../middlewares/validationMiddleware.js")

const router=require('express').Router()

router.post("/login",validate(loginSchema),login)

router.post("/register",validate(registerSchema),register)

router.post("/verify",verifyRegistration)

router.post("/refresh",getAccesstoken)

router.post("/resetpassword",validate(emailValidator),sendPassWordResetOtp)

router.post("/verifyresetotp",verifyPassWordResetOtp)

router.patch("/resetpassword",validate(passwordValidator),resetPassword)

module.exports=router