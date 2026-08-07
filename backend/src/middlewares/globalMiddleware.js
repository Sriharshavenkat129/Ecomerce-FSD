const globalMiddleware=(error,req,res,next)=>{
    try{
        res.status(error.status).json({"msg":error.msg})
    }
    catch(error){
        res.status(500).json({"msg":"Internal Server Error"})
    }
}

module.exports=globalMiddleware