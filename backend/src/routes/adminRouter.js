const router=require('express').Router()
//product controllers
const {getAllProducts,getProductById,addProduct,updateProduct,deleteProduct}=require("../controllers/productControllers")
//order controllers
const {getAllOrders,getOrderById,completeOrder} =require("../controllers/orderControllers")
//admin controler for dashboard
const {getReport} = require("../controllers/adminControllers") 
//mutler and cloudinary for adding product
const upload=require("../middlewares/multerMiddleware")

router.get('/',getReport)

router.get('/products',getAllProducts)

router.get('/products/:product_id',getProductById)

router.post('/products',upload.single('product_image'),addProduct)

router.patch('/products',updateProduct)

router.delete('/products/:product_id',deleteProduct)

router.get('/orders',getAllOrders)

router.get('/orders/:order_id',getOrderById)

router.patch('/orders',completeOrder)

module.exports=router