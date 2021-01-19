import * as express from 'express'
import * as ffmpeg from 'fluent-ffmpeg'
import { ensureDir } from 'fs-extra'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as multer from 'multer'
import { join, parse } from 'path'
import { v4 } from 'uuid'
import { sequelize } from './server/database'
import { VideoModel } from './server/models/video'
type TranscodeOptions = {
    inputPath: string,
    outputPath: string,
}
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
app.use(cors({
    origin: function(origin, callback) {
        console.debug(origin)
        callback(null)
    }
}))
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
app.get('/api/v1/video/watch', (req: express.Request, res: express.Response) => {
    res.download('/Users/jinbeom/2021-toy-project/storage/hls/323fccf6-b087-4c0b-a784-e3dbcc198846/out.m3u8')
})
app.get('/api/v1/video/out.mp4', (req: express.Request, res: express.Response) => {
    res.download('/Users/jinbeom/2021-toy-project/storage/hls/323fccf6-b087-4c0b-a784-e3dbcc198846/out.mp4')
})
app.listen(port, () => {
    console.info('express successfully started')
})
function uploadVideo(req: express.Request, res: express.Response) {
    const videoModel = new VideoModel({ uuid: parse(req.file.filename).name })
    videoModel.save()
    transcode({
       inputPath: req.file.path, 
       outputPath: join('storage/hls', parse(req.file.filename).name)
    })
    res.sendStatus(200)
}
function transcode(options: TranscodeOptions) {
    ensureDir(options.outputPath)
    ffmpeg(options.inputPath)
    .audioCodec('copy')
    .videoCodec('copy')
    .addOption(`-hls_segment_filename ${join(options.outputPath, 'out.mp4')}`)
    .addOption('-hls_segment_type fmp4')
    .addOption('-hls_flags single_file')
    .addOption('-hls_playlist_type vod')
    .output(join(options.outputPath, 'out.m3u8'))
    .on('end', function() {
        console.info('transcoding finished')
    })
    .run()
}