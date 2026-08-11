const router=require('express').Router()
const {userAuth}=require('../middlewares/authMiddlewares')
const {getAllProducts,getProductById,getProductByCategory,getProductsByQuery}=require("../controllers/productControllers")

router.get('/',userAuth,getAllProducts)

router.get('/products/:category',userAuth,getProductByCategory)

router.get('/products',userAuth,getProductsByQuery)

router.get('/product/:id',userAuth,getProductById)

router.post('/products/order',userAuth,(req,res)=>{
    res.send("order the product")
})

router.post('/products/cart',userAuth,(req,res)=>{
    res.send("add product into cart")
})

router.get('/me/cart',userAuth,(req,res)=>{
    res.send('all carted products')
})

router.patch('/me/cart',userAuth,(req,res)=>{
    res.send('remove product from cart')
})

router.post('/me/cart/order',userAuth,(req,res)=>{
    res.send('order all from cart')
})

router.get('/me',userAuth,(req,res)=>{
    res.send('send user details')
})

router.patch('/me',userAuth,(req,res)=>{
    res.send("update user details")
})

router.get('/me/orders',userAuth,(req,res)=>{
    res.send('return all orders')
})

router.get('/me/orders/:id',userAuth,(req,res)=>{
    res.send("get particular order details")
})

router.patch('/me/orders/cancel',userAuth,(req,res)=>{
    res.send("cancel particular order")
})

router.patch('/me/orders/paynow',userAuth,(req,res)=>{
    res.send("payment via upi")
})

router.post('/me/address',userAuth,(req,res)=>{
    res.send("user adds new address")
})

module.exports=router