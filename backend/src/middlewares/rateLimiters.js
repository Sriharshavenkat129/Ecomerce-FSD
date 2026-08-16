const rateLimit=require("express-rate-limit")

const authLimiter=rateLimit({
    windowMs:15*60*1000,
    max:5
})

const generalLimiter=rateLimit({
    window:15*60*1000,
    max:100
})

module.exports={authLimiter,generalLimiter}