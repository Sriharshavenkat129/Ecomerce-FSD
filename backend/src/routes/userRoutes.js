const router=require('express').Router()
const {userAuth}=require('../middlewares/authMiddlewares')
//product related controllers
const {getAllProducts,getProductById,getProductByCategory,getProductsByQuery}=require("../controllers/productControllers")
//order related controllers
const {placeOrder, getUserOrders,getUserOrderById,cancelOrder,returnOrder,payNow}=require("../controllers/orderControllers")
//cart related controllers
const {addProductIntoCart,getAllCartedProducts,removeCartedProduct,orderAllFromCart}=require("../controllers/cartControllers")

router.get('/',userAuth,getAllProducts)

router.get('/products/:category',userAuth,getProductByCategory)

router.get('/products',userAuth,getProductsByQuery)

router.get('/product/:product_id',userAuth,getProductById)

router.post('/products/order',userAuth,placeOrder)

router.get('/me/orders',userAuth,getUserOrders)

router.get('/me/orders/:order_id',userAuth,getUserOrderById)

router.patch('/me/orders/cancel',userAuth,cancelOrder)

router.post("/me/orders/return",userAuth,returnOrder)

router.patch('/me/orders/paynow',userAuth,payNow)

router.post('/products/cart',userAuth,addProductIntoCart)

router.get('/me/cart',userAuth,getAllCartedProducts)

router.delete('/me/cart/:cart_id',userAuth,removeCartedProduct)

router.post('/me/cart/order',userAuth,orderAllFromCart)

router.get('/me',userAuth,(req,res)=>{
    res.send('send user details')
})

router.patch('/me',userAuth,(req,res)=>{
    res.send("update user details")
})


router.post('/me/address',userAuth,(req,res)=>{
    res.send("user adds new address")
})

module.exports=router