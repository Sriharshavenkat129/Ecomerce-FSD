const router=require('express').Router()
const {userAuth,adminAuth}=require('../middlewares/authMiddlewares')
//product controllers
const {getAllProducts,getProductById,addProduct,updateProduct,deleteProduct}=require("../controllers/productControllers")
//order controllers
const {getAllOrders,getOrderById,completeOrder} =require("../controllers/orderControllers")
//admin controler for dashboard
const {getReport} = require("../controllers/adminControllers") 

router.get('/',userAuth,adminAuth,getReport)

router.get('/products',userAuth,adminAuth,getAllProducts)

router.get('/products/:product_id',userAuth,adminAuth,getProductById)

router.post('/products',userAuth,adminAuth,addProduct)

router.patch('/products',userAuth,adminAuth,updateProduct)

router.delete('/products/:product_id',userAuth,adminAuth,deleteProduct)

router.get('/orders',userAuth,adminAuth,getAllOrders)

router.get('/orders/:order_id',userAuth,adminAuth,getOrderById)

router.patch('/orders',userAuth,adminAuth,completeOrder)

module.exports=router