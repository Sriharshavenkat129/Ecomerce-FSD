const {z} =require("zod")

const createProductSchema=z.object({

    product_id:z.string().optional(),

    product_name:z.string({"message":"name required!"})
    .trim().min(5,{"message":"name must have atleast 5 character"})
    .max(30,{"message":"name is too long"}),

    product_description:z.string({"message":"product description required!"})
    .trim().min(10,{"message":"description is tpp short"}),

    price:z.coerce.number({"message":"price must be a number"})
    .min(1,{"message":"price cannot be zero or negative"}),

    stock:z.coerce.number({"message":"stock must be a number"})
    .min(0,{"message":"stock cannot be negative"}),

    category: z.enum(["groceries", "electronics", "fashion"], {
        errorMap: () => ({ message: "Only fashion, electronics, and groceries categories are accepted" })
    }),

    is_available:z.coerce.boolean({"message":"enter a valid boolean value"})
    .default(true)
    .optional()
})

// const updateProductSchema=z.object({
//     product_name:z.string({"message":"name required!"})
//     .trim().min(5,{"message":"name must have atleast 5 character"})
//     .max(30,{"message":"name is too long"})
//     .optional(),

//     product_description:z.string({"message":"product description required!"})
//     .trim().min(10,{"message":"description is tpp short"})
//     .optional(),

//     price:z.number({"message":"price must be a number"})
//     .min(1,{"message":"price cannot be zero or negative"})
//     .optional(),

//     stock:z.number({"message":"stock must be a number"})
//     .min(0,{"message":"stock cannot be negative"})
//     .optional(),

//     category: z.enum(["groceries", "electronics", "fashion"], {
//         errorMap: () => ({ message: "Only fashion, electronics, and groceries categories are accepted" })
//     })
//     .optional(),

//     is_available:z.boolean({"message":"enter a valid boolean value"})
//     .optional()
// })

const updateProductSchema=createProductSchema.partial()

module.exports={createProductSchema,updateProductSchema}