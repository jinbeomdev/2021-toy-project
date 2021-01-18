import * as express from 'express'
import * as multer from 'multer'
import { parse } from 'path'
import { v4 } from 'uuid'
import { sequelize } from './server/database'
import { VideoModel } from './server/models/video'
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
            cb(null, v4() + parse(file.originalname).ext)
        }
    })
    const upload = multer({ storage })
    return upload.single('videoFile')
} 
function uploadVideo(req: express.Request, res: express.Response) {
    const videoModel = new VideoModel({ uuid: parse(req.file.filename).name })
    videoModel.save()
    res.sendStatus(200)
}
app.listen(port, () => {
    console.info('express successfully started')
})