const pool=require('../config/db')

//user related conttrollers
const placeOrder=async (req,res,next)=>{
    const {product_id,quantity,payment_type,address_id}=req.body
    const status=payment_type=="upi"?"completed":"pending"
    let con;
    if(!product_id || !quantity || !payment_type || !address_id)
        return next({"status":400,"msg":"incomplete details!"})
    if(quantity<=0)
        return next({"status":400,"msg":"unable to order for this quantity"})
    try{
        con=await pool.connect()
        await con.query("begin")
        const product_details=await con.query("select stock,price,is_available from products where product_id=$1",[product_id])
        if(product_details.rows.length==0){
            await con.query('rollback')
            return next({"status":404,"msg":"product not found!"})
        }
        const product=product_details.rows[0]
        if(quantity>product.stock || product.is_available==false){
            await con.query('rollback')
            return next({"status":400,"msg":"product is out of stock for your order!"})
        }
        await con.query("update products set stock=$1 where product_id=$2",
            [product.stock-quantity,product_id]
        )
        const transaction_details=await con.query("insert into transactions (payment_type,total_amount,payment_status)\
            values($1,$2,$3) returning transaction_id",[payment_type,product_details.rows[0].price*quantity,status])
        if(transaction_details.rows.length==0){
            await con.query('rollback')
            return next({"status":500,"msg":"order not placed!"})
        }
        await con.query("insert into orders (user_id,product_id,address_id,quantity,transaction_id,unit_price)\
            values($1,$2,$3,$4,$5,$6)",[req.user.user_id,product_id,address_id,quantity,
                transaction_details.rows[0].transaction_id,product.price])
        await con.query('commit')
        res.status(201).json({"msg":"order placed!"})
    }
    catch(error){
        if(con) await con.query('rollback')
        next({"status":500,"msg":"order not placed!"})
    }
    finally{
        if(con)
            await con.release()
    }
}

const getUserOrders=async (req,res,next)=>{
    if(!req.user.user_id)
        return next({"status":400,"msg":"user details missing!"})
    try{
        const result=await pool.query("select o.order_id,o.status,o.quantity,o.unit_price,\
            p.product_name,p.product_image,a.location,a.pincode,a.state from orders o\
            left join products p on p.product_id=o.product_id\
            left join addresses a on a.address_id=o.address_id\
            where o.user_id=$1",[req.user.user_id])
        if(result.rows.length==0)
            return next({"status":404,"msg":"no orders yet!"})
        res.status(200).json({"msg":"orders fetched successfully","data":result.rows})
    }
    catch(error){
        console.log(error)
        next({"status":500,"msg":"something went wrong"})
    }
}

const getUserOrderById=async (req,res,next)=>{
    const order_id=req.params.order_id
    if(!order_id)
        return next({"status":400,"msg":"order id required!"})
    try{
        const result=await pool.query('select o.order_id,o.status,o.quantity,o.unit_price,\
            p.product_id,p.product_name,p.product_image,p.is_available,\
            a.location,a.pincode,a.state,\
            t.transaction_id,t.payment_type,t.payment_status,t.total_amount\
            from orders o left join products p\
            on o.product_id=p.product_id left join addresses a on\
            o.address_id=a.address_id left join transactions t\
            on t.transaction_id=o.transaction_id\
            where o.order_id=$1 and o.user_id=$2',[order_id,req.user.user_id])
        if(result.rows.length==0)
            return next({"status":400,"msg":"no order with this id!"})
        res.status(200).json({"msg":"order details fetched successfully","data":result.rows})
    }
    catch(error){
        next({"status":500,"msg":"something went wrong!"})
    }
}

const cancelOrder=async (req,res,next)=>{
    const {product_id,order_id,transaction_id,quantity}=req.body
    if(!order_id)
        return next({"status":400,"msg":"order id required!"})
    if(quantity<=0)
        return next({"status":400,"msg":"unable to process with this quantity"})
    let con;
    try{
        con=await pool.connect()
        await con.query('begin')
        const productResult=await con.query("select is_available,stock from products where product_id=$1 for update",[product_id])
        if(productResult.rows.length==0){
            await con.query('rollback')
            return next({"status":404,"msg":"product not found"})
        }
        if(productResult.rows[0].is_available==false){
            await con.query('rollback')
            return next({"status":500,"msg":"unable to process cancellation for this product"})
        }
        const orderResult=await con.query('select quantity,unit_price,status from orders where order_id=$1',[order_id])
        if(orderResult.rows.length==0){
            await con.query('rollback')
            return next({"status":404,"msg":"order not found!"})
        }
        if(orderResult.rows[0].quantity==0){
            await con.query('rollback')
            return next({"status":500,"msg":"no order is in process to cancel"})
        }
        if(orderResult.rows[0].status!="created"){
            await con.query('rollback')
            return next({"status":500,"msg":"order not in process already!"})
        }
        const transactionResult=await con.query("select payment_type,payment_status,total_amount from transactions where transaction_id=$1",[transaction_id])
        if(transactionResult.rows.length==0){
            await con.query('rollback')
            return next({'status':500,"msg":"something went wrong!"})
        }
        if(quantity>orderResult.rows[0].quantity){
            await con.query('rollback')
            return next({"status":500,"msg":"cancellation failed"})
        }
        if(quantity==orderResult.rows[0].quantity){
            await con.query("update orders set status=$1 where order_id=$3",["cancelled",order_id])
            await con.query("update products set stock=$1 where product_id=$2",[productResult.rows[0].stock+quantity,product_id])
            if(transactionResult.rows[0].payment_status=="pending")
                await con.query('update transactions set payment_status=$1 where transaction_id=$2',["cancelled",transaction_id])
            else
                await con.query("update transactions set payment_status=$1 where transaction_id=$2",["refunded",transaction_id])
        }
        else{
            await con.query("update products set stock=$1 where product_id=$2",
                [productResult.rows[0].stock+quantity,product_id])
            if(transactionResult.rows[0].payment_status=='pending'){
                await con.query("update orders set quantity=$1 where order_id=$2",
                    [orderResult.rows[0].quantity-quantity,order_id])
                await con.query("update transactions set total_amount=$1 where transaction_id=$2",
                    [transactionResult.rows[0].total_amount-(quantity*orderResult.rows[0].unit_price),transaction_id])
            }
            else if(transactionResult.rows[0].payment_status=='completed'){
                const transactionDetails=await con.query("insert into transactions (payment_type,payment_status,total_amount) \
                    values($1,$2,$3) returning transaction_id",
                    ["upi","refunded",orderResult.rows[0].unit_price*quantity]
                )
                await con.query("insert into orders (user_id,product_id,address_id,quantity,status,unit_price,transaction_id)\
                    values($1,$2,$3,$4,$5,$6,$7)",[req.user.user_id,product_id,null,quantity,"cancelled",
                        orderResult.rows[0].unit_price,transactionDetails.rows[0].transaction_id])
            }
            else{
                await con.query('rollback')
                return next({"status":500,"msg":"something went wrong!"})
            }
        }
        await con.query('commit')
        res.status(200).json({"msg":"order cancelled successfully"})
    }
    catch(error){
        if(con)
            await con.query('rollback')
        next({"status":500,"msg":"something went wrong"})
    }
    finally{
        if(con)
            await con.release()
    }
}

const returnOrder=async (req,res,next)=>{
    const {order_id,quantity}=req.body
    if(quantity<=0)
        return next({"status":400,"msg":"unableto process with this quantity"})
    let con;
    try{
        con=await pool.connect()
        await con.query('begin')
        const result=await con.query("select quantity,unit_price,address_id,product_id from orders where order_id=$1 for update",[order_id])
        if(result.rows.length==0){
            await con.query('rollback')
            return next({"status":404,"msg":"cannot find the order"})
        }
        const amount=result.rows[0].unit_price*quantity
        const transactionDetails=await con.query('insert into transactions (payment_type,payment_status,total_amount)\
            values($1,$2,$3) returning transaction_id',["upi","refunded",amount])
        if(quantity==result.rows[0].quantity){
            await con.query('delete from orders where order_id=$1',[order_id])
        }
            await con.query('insert into orders (user_id,product_id,address_id,quantity,status,transaction_id,unit_price)\
                values($1,$2,$3,$4,$5,$6,$7)',[req.user.user_id,result.rows[0].product_id,result.rows[0].address_id,quantity,
            "returned",transactionDetails.rows[0].transaction_id,result.rows[0].unit_price])
            await con.query('update orders set quantity=$1 where order_id=$2',[result.rows[0].quantity-quantity,order_id])
        if(quantity>result.rows[0].quantity){
            await con.query('rollback')
            return next({"status":500,"msg":"you did`t ordered  that many products to return!"})
        }
        await con.query('commit')
        res.status(200).json("order returned successfully")
    }
    catch(error){
        if(con)
            await con.query('rollback')
        next({"status":500,"msg":"returning order failed"})
    }
    finally{
        if(con)
            await con.release()
    }
}

const payNow=async (req,res,next)=>{
    const {order_id}=req.body
    let con;
    if(!order_id)
        return next({"status":400,"msg":"order id required!"})
    try{
        con=await pool.connect()
        await con.query('begin')
        const result=await con.query("select o.transaction_id,o.status,t.payment_status from orders o left join\
            transactions t on o.transaction_id=t.transaction_id where o.order_id=$1",[order_id])
        if(result.rows[0].length==0){
            await con.query('rollback')
            return next({"status":404,"msg":"order not found with provided order_id"})
        }
        if(result.rows[0].status!="created"){
            await con.query('rollback')
            return next({"status":500,"msg":"you cannot pay for this order!"})
        }
        if(result.rows[0].payment_status!="pending"){
            await con.query('rollback')
            return next({"status":500,"msg":"order payment alredy done!"})
        }
        await con.query("update transactions set payment_type=$1,payment_status=$2 where transaction_id=$3",
            ["upi","completed",result.rows[0].transaction_id]
        )
        await con.query('commit')
        res.status(200).json({"msg":"payment success!"})
    }
    catch(error){
        if(con)
            await con.query('rollback')
        res.status({"status":500,"msg":"payment failed!"})
    }
    finally{
        if(con)
            await con.release()
    }
}

//admin related controllers
const getAllOrders=async (req,res,next)=>{
    try{
        const result=await pool.query("select o.order_id,o.quantity,o.unit_price,o.status,o.created_at,\
            p.product_name,p.product_image \
            from orders o left join products p on o.product_id=p.product_id")
        if(result.rows.length==0)
            return next({"status":404,"msg":"no orders yet!"})
        res.status(200).json({"msg":"orders fetched successfully","data":result.rows})
    }
    catch(error){
        next({'status':500,"msg":"unable to fetch orders"})
    }
}

const getOrderById=async (req,res,next)=>{
    const order_id=req.params.order_id
    try{
        const result=await pool.query(" select p.product_name,p.product_image,o.unit_price,o.quantity,o.status,\
            t.payment_type,t.payment_status,\
            u.name,a.location,a.pincode,a.state from orders o\
            left join products p on o.product_id=p.product_id\
            left join transactions t on t.transaction_id=o.transaction_id\
            left join addresses a on o.address_id=a.address_id\
            left join users u on u.user_id=o.user_id\
            where o.order_id=$1",[order_id])
        if(result.rows.length==0)
            return next({'status':404,"msg":"order not found!"})
        res.status(200).json({'msg':"order details fetched successfully","data":result.rows})
    }
    catch(error){
        next({"status":500,"msg":"unable to fetch details"})
    }
}

const completeOrder=async (req,res,next)=>{
    const {order_id}=req.body
    let con;
    try{
        con=await pool.connect();
        await con.query('BEGIN')
        const transaction_details=await con.query("select transaction_id from orders where order_id=$1 for update",[order_id])
        if(transaction_details.rows.length==0){
            await con.query('rollback')
            return next({"status":400,"msg":"no order found with this id!"})
        }
        const transaction_id=transaction_details.rows[0].transaction_id
        await con.query("update orders set status=$1 where order_id=$2",["delivered",order_id])
        await con.query("update transactions set payment_status=$1 where transaction_id=$2",["completed",transaction_id])
        await con.query('commit')
        res.status(200).json({"msg":"order marked as delivered!"})
    }
    catch(error){
        if(con)
            await con.query('rollback')
        console.log(error)
        next({"status":500,"msg":"unable to deliver the order"})
    }
    finally{
        if(con)
            await con.release()
    }
}

module.exports={getAllOrders,getOrderById,completeOrder,placeOrder,getUserOrders,
                getUserOrderById,cancelOrder,returnOrder,payNow}