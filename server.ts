import * as express from 'express'
import * as morgan from 'morgan'
import * as multer from 'multer'
import { join, parse } from 'path'
import { v4 } from 'uuid'
import { sequelize } from './server/database'
import { VideoModel } from './server/models/video'
import { queue } from './server/redis'

sequelize.authenticate()
.then(() => {
    sequelize.sync()
    console.info('database successfully is connected')
})
.catch(() => {
    process.exit(1)
})
const app = express()
const port = 3000
app.use(morgan('combined'))
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
app.use('/static/hls', express.static('storage/hls', { fallthrough: false }))
app.listen(port, () => {
    console.info('express successfully started')
})
function uploadVideo(req: express.Request, res: express.Response) {
    const videoModel = new VideoModel({ uuid: parse(req.file.filename).name })
    videoModel.save()
    queue.add('job', {
       inputPath: req.file.path, 
       outputPath: join('storage/hls', parse(req.file.filename).name)
    })
    res.sendStatus(200)
}