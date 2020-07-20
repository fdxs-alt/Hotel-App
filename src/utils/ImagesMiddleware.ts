import multer from 'multer'
import path from 'path'
import { Request } from 'express'

export const dir = path.join(__dirname, '../../images/')
const imageFilter = (req: Request, file: any, callback: CallableFunction) => {
    if (file.mimetype.startsWith('image')) {
       
        callback(null, true)
    } else {
        console.log(file.mimetype)
        callback('Upload only images', false)
    }
}
let storage = multer.diskStorage({
    destination: (req: Request, file, callback: CallableFunction) => {
        callback(null, dir)
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`)
    },
})

const uploadFile = multer({ storage: storage, fileFilter: imageFilter })
export default uploadFile
