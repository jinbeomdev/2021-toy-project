import * as multer from 'multer'
import { v4 } from 'uuid'
import { parse } from 'path'

function storeVideo() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'storage/tmp') 
        },
        filename: (req, file, cb) => {
            cb(null, v4() + parse(file.originalname).ext)
        }
    })
    const upload = multer({ storage })
    return upload.single('videoFile')
}

export {
    storeVideo
}