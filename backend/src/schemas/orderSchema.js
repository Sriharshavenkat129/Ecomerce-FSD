const {z, number}=require('zod')

const placeOrderSchema=z.object({
    product_id:z.string("product_id is required")
    .min(10),
    quantity:z.number().int().min(1,"quantity must be greater than 0"),
    payment_type:z.enum(["upi","cod"],{
        errorMap: () => ({ message: "Only upi,cod are accepted" })
    }),
    address_id:z.string("address id is required")
})

const cancelOrderSchema=z.object({
    order_id:z.string("order id is required"),
    product_id:z.string("product id is required"),
    transaction_id:z.string('transaction id is required'),
    quantity:z.number().int().min(1,"qunatity must be greater than 0")
})

const returnOrderSchema=z.object({
    order_id:z.string("order id is required"),
    quantity:z.number().int().min(1,"quantity must be greater than 0")
})

module.exports={placeOrderSchema,cancelOrderSchema,returnOrderSchema}