import * as express from 'express'
import * as multer from 'multer'
import { sequelize } from './server/database'
sequelize.authenticate()
.then(() => {
    sequelize.sync()
    console.info('database successfully connected')
})
.catch(() => {
    process.exit(1)
})
const app = express()
const port = 3000
const videoStorer = storeVideo()
app.post('/api/v1/video/upload', videoStorer, uploadVideo)
function storeVideo() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'storage/tmp') 
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    })
    const upload = multer({ storage })
    return upload.single('videoFile')
} 
function uploadVideo(req: express.Request, res: express.Response) {
    res.sendStatus(200)
}
app.listen(port, () => {
    console.info('express successfully started')
})