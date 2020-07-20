import multer from 'multer'
import path from 'path'
import { Request } from 'express'
const imageFilter = (req: Request, file: any, callback: CallableFunction) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback('Upload only images', false)
    }
}
const storage = multer.diskStorage({
    destination: (req, file, callback: CallableFunction) => {
        callback(null, +path.resolve() + '\\images\\')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`)
    },
})

const uploadFile = multer({ storage: storage, fileFilter: imageFilter })
export default uploadFile
