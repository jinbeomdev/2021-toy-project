import * as express from 'express'
import { parse, join } from 'path'
import { storeVideo } from '../../express'
import { VideoModel } from '../../models/video'
import { queue } from '../../redis'

const videoRouter = express.Router()

const videoStorer = storeVideo()
videoRouter.post('/video/upload', videoStorer, uploadVideo)
videoRouter.get('/video/list', getVideoList)

export {
    videoRouter
}

function uploadVideo(req: express.Request, res: express.Response) {
    const videoModel = new VideoModel({ uuid: parse(req.file.filename).name, waitTranscoding: true })
    videoModel.save()
    queue.add('job', {
       inputPath: req.file.path, 
       outputPath: join('storage/hls', parse(req.file.filename).name),
       uuid: parse(req.file.filename).name
    })
    res.sendStatus(200)
}

async function getVideoList(req: express.Request, res: express.Response) {
    const video = await VideoModel.findAll()
    return res.json(video)
}