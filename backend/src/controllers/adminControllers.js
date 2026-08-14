const pool=require("../config/db")

const getReport=async (req,res,next)=>{
    try{
        const result=await pool.query("select EXTRACT (year from created_at) as year,\
            EXTRACT (month from created_at) as month,\
            EXTRACT (day from created_at) as day,count(*) as total_orders from orders group by\
            rollup (EXTRACT (year from created_at), EXTRACT(day from created_at),\
            EXTRACT (month from created_at))")
        res.status(200).json({"msg":"dashboard fetched!","data":result.rows})
    }
    catch(error){
        next({"status":500,"msg":"something went wrong!"})
    }
}

module.exports={getReport}