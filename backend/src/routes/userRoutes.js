const router=require('express').Router()
const {userAuth}=require('../middlewares/authMiddlewares')
const {passwordSchema,addressSchema}=require("../schemas/userSchema")
const {placeOrderSchema,cancelOrderSchema,returnOrderSchema}=require("../schemas/orderSchema")
const validate=require("../middlewares/validationMiddleware")
//product related controllers
const {getAllProducts,getProductById,getProductByCategory,getProductsByQuery}=require("../controllers/productControllers")
//order related controllers
const {placeOrder, getUserOrders,getUserOrderById,cancelOrder,returnOrder,payNow}=require("../controllers/orderControllers")
//cart related controllers
const {addProductIntoCart,getAllCartedProducts,removeCartedProduct,orderAllFromCart}=require("../controllers/cartControllers")
//user related controllers 
const {getUserDetails,updateUserPassWord, addAddress}=require("../controllers/userControllers")

router.get('/',userAuth,getAllProducts)

router.get('/products/:category',userAuth,getProductByCategory)

router.get('/products',userAuth,getProductsByQuery)

router.get('/product/:product_id',userAuth,getProductById)

router.post('/products/order',userAuth,validate(placeOrderSchema),placeOrder)

router.get('/me/orders',userAuth,getUserOrders)

router.get('/me/orders/:order_id',userAuth,getUserOrderById)

router.patch('/me/orders/cancel',userAuth,validate(cancelOrderSchema),cancelOrder)

router.post("/me/orders/return",userAuth,validate(returnOrderSchema),returnOrder)

router.patch('/me/orders/paynow',userAuth,payNow)

router.post('/products/cart',userAuth,addProductIntoCart)

router.get('/me/cart',userAuth,getAllCartedProducts)

router.delete('/me/cart/:cart_id',userAuth,removeCartedProduct)

router.post('/me/cart/order',userAuth,orderAllFromCart)

router.get('/me',userAuth,getUserDetails)

router.patch('/me',userAuth,validate(passwordSchema),updateUserPassWord)


router.post('/me/address',userAuth,validate(addressSchema),addAddress)

module.exports=router