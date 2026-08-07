const {z}=require('zod')

const validate=(schema)=>(req,res,next)=>{
    const result=schema.safeParse(req.body)
    if(!result.success){
        const error=result.error.issues[0].message
        return next({"status":400,"msg":error})
    }
    req.body=result.data
    next()
}

module.exports=validate