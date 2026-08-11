const multer=require('multer')
const { file } = require('zod')

const storage=multer.memoryStorage()
const fileFilter=async (req,file,cb)=>{
    if(file.mimetype.startsWith('image/'))
        cb(null,true)
    else {
        cb(new Error("only image files are accepted!"),false)
    }
}

const upload=multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{ fileSize:5*1024*1025 }//5mb max storage
})

module.exports=upload