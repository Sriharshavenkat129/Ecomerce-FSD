const router=require('express').Router()
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
const {getUserDetails,updateUserPassWord, addAddress, getUserAddresses}=require("../controllers/userControllers")

router.get('/',getAllProducts)

router.get('/products/:category',getProductByCategory)

router.get('/products',getProductsByQuery)

router.get('/product/:product_id',getProductById)

router.post('/products/order',validate(placeOrderSchema),placeOrder)

router.get('/me/orders',getUserOrders)

router.get('/me/orders/:order_id',getUserOrderById)

router.patch('/me/orders/cancel',validate(cancelOrderSchema),cancelOrder)

router.post("/me/orders/return",validate(returnOrderSchema),returnOrder)

router.patch('/me/orders/paynow',payNow)

router.post('/products/cart',addProductIntoCart)

router.get('/me/cart',getAllCartedProducts)

router.delete('/me/cart/:cart_id',removeCartedProduct)

router.post('/me/cart/order',orderAllFromCart)

router.get('/me/profile',getUserDetails)

router.patch('/me/profile',validate(passwordSchema),updateUserPassWord)

router.get("/me/address",getUserAddresses)

router.post('/me/address',validate(addressSchema),addAddress)

module.exports=router