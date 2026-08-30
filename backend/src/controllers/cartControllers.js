const { error } = require("node:console")
const pool = require("../config/db")

const addProductIntoCart = async (req, res, next) => {
    const { product_id } = req.body
    if (!product_id)
        return next({ "status": 400, "msg": "product_id required!" })
    try {
        const result = await pool.query("select * from carts where user_id=$1 and product_id=$2", [req.user.user_id, product_id])
        if (result.rows.length == 1)
            return next({ 'status': 409, "msg": 'product already in cart!' })
        await pool.query("insert into carts (product_id,user_id) values($1,$2)", [product_id, req.user.user_id])
        res.status(200).json({ "msg": "product added into cart" })
    }
    catch (error) {
        next({ "status": 500, "msg": "adding product into cart failed!" })
    }
}

const getAllCartedProducts = async (req, res, next) => {
    try {
        const result = await pool.query("select c.cart_id,p.product_id,p.product_name,p.product_description,p.product_image,p.price,p.stock,p.is_available\
            from carts c left join products p on c.product_id=p.product_id where c.user_id=$1", [req.user.user_id])
        if (result.rows.length == 0)
            return next({ "status": 404, "msg": "car is empty right now!" })
        res.status(200).json({ "msg": "cart fetched successfully", "data": result.rows })
    }
    catch (error) {
        next({ "status": 500, "msg": "something went wrong!" })
    }
}

const removeCartedProduct = async (req, res, next) => {
    const cart_id = req.params.cart_id
    if (!cart_id)
        return next({ "status": 400, "msg": "cart_id required!" })
    try {
        await pool.query("delete from carts where cart_id=$1", [cart_id])
        res.status(200).json({ "msg": 'product removed form the cart' })
    }
    catch (error) {
        next({ "status": 500, "msg": "failed to remove the product" })
    }
}

const orderAllFromCart = async (req, res, next) => {
    const { cartedProducts, payment_type, address_id } = req.body
    if(!payment_type || !address_id)return res.status(400).json({"msg":"address and payment_type required"})
    const status = payment_type == "upi" ? "completed" : "pending"
    if (cartedProducts.length == 0)
        return next({ "status": 400, "msg": "no products in the cart to process order" })
    let con;
    try {
        let orderedProducts = []
        con = await pool.connect()
        con.query('begin')
        for (const cartedProduct of cartedProducts) {
            try {
                const { cart_id, product_id, quantity } = cartedProduct
                if (!cart_id || !product_id || !quantity) {
                    con.query('rollback')
                    return next({ "status": 400, "msg": "product_id ,cart_id and quantity are required!" })
                }
                if (quantity <= 0) {
                    await con.query('rollback')
                    return next({ "status": 400, "msg": "qunatity alteast be one" })
                }
                const cart = await con.query("select * from carts where cart_id=$1", [cart_id])
                if (cart.rows.length == 0) {
                    await con.query('rollback')
                    return next({ "status": 404, "msg": "failed to place the order" })
                }
                const product_details = await con.query("select stock,price,is_available from products where product_id=$1", [product_id])
                if (product_details.rows.length == 0) {
                    await con.query('rollback')
                    return next({ "status": 404, "msg": "product not found!" })
                }
                const product = product_details.rows[0]
                if (quantity > product.stock || product.is_available == false) {
                    await con.query('rollback')
                    return next({ "status": 400, "msg": "product is out of stock for your order!" })
                }
                await con.query("update products set stock=$1 where product_id=$2",
                    [product.stock - quantity, product_id]
                )
                const transaction_details = await con.query("insert into transactions (payment_type,total_amount,payment_status)\
                    values($1,$2,$3) returning transaction_id", [payment_type, product_details.rows[0].price * quantity, status])
                if (transaction_details.rows.length == 0) {
                    await con.query('rollback')
                    return next({ "status": 500, "msg": "order not placed!" })
                }
                await con.query("insert into orders (user_id,product_id,address_id,quantity,transaction_id,unit_price)\
                        values($1,$2,$3,$4,$5,$6)", [req.user.user_id, product_id, address_id, quantity,
                transaction_details.rows[0].transaction_id, product.price])

                orderedProducts.push(product_id)
            }
            catch (error) {
                throw new Error("unable to process the order")
            }
        }
        await con.query('delete from carts where user_id=$1 and product_id = ANY($2::uuid[])', [req.user.user_id, orderedProducts])
        await con.query('commit')
        res.status(201).json({ "msg": "order placed successfully" })
    }
    catch (error) {
        if (con)
            await con.query('rollback')
        next({ "status": 500, "msg": "unable to place the order" })
    }
    finally {
        if (con)
            await con.release()
    }
}



module.exports = { addProductIntoCart, getAllCartedProducts, removeCartedProduct, orderAllFromCart }